import classNames from 'classnames/bind';
import styles from './Popup.module.scss';

const cx = classNames.bind(styles);

export interface PopupProps {
    show?: boolean;
    children?: React.ReactNode;
    className?: string;
}

function Popup({ show = false, children, className }: PopupProps) {
    return show ? <div className={cx('wrapper', className)}>{children}</div> : null;
}

export default Popup;
