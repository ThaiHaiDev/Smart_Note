import styles from './Search.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Search = () => {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('search_icon')}></div>
            <input className={cx('search_input')} placeholder="Search" />
        </div>
    );
};

export default Search;
