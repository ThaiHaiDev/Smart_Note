import './GlobalStyles.scss';

interface childrenProps {
    children: any;
}

const GlobalStyles = ({ children }: childrenProps) => {
    return children;
};

export default GlobalStyles;
