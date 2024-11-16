import NewsItem from './NewsItem';

const NewsGrid = ({className, items }) => {
    return (
        <div className={className}>
        {items.map((item, index) => (<NewsItem key={index} item={item}/>))}
        </div>
    );
    }

export default NewsGrid;