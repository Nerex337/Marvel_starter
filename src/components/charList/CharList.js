import './charList.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';



class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    myRef = React.createRef();

    marvelService = new MarvelService();

    arrayRef = []

    componentDidMount() {
        this.onRequest();
    }

    pushRef = (el) => {
        this.arrayRef.push(el)
    }

    focusChar = (id) => {
        this.arrayRef.forEach(element => {
            element.classList.remove('char__item_selected');
        });
        this.arrayRef[id].className += ' char__item_selected'
        this.arrayRef[id].focus()
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length<9) {
            ended = true;
        }

        this.setState(({offset, charList}) => ({
             charList: [...charList,...newCharList],
             loading: false,
             newItemLoading: false,
             offset: offset + 9,
             charEnded: ended
        }))
    }

    onError = () => {
        this.setState({ loading: false, error: true })
    }

    createContent = ( charList ) => {
        const view = charList.map((char,i) => {
            const { name, thumbnail, id } = char;

            let imgStyle = { 'objectFit': 'cover' };
            if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'contain' };
            }
            return (
                <li className="char__item" key={id} ref={this.pushRef} onClick={() => {this.props.onCharSelected(id);this.focusChar(i);}}>
                    <img src={thumbnail} alt={name} style={imgStyle} />
                    <div className="char__name">{name}</div>
                </li>
            )
        });
        console.log(this.arrayRef)
        return (
            <ul className="char__grid">
                {view}
            </ul>
        )
    }

    render() {
        const { charList, loading, error, offset, newItemLoading, charEnded } = this.state;
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null
        const content = !(loading || error) ? this.createContent(charList) : null

        return (
            <div className="char__list">
                <ul className="char__grid">
                    {errorMessage}
                    {spinner}
                    {content}
                </ul>
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;