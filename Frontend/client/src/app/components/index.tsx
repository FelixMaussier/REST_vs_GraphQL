import FetchProductsButton from '@/app/components/FetchProductsButton';

const HomePage = () => {
    return (
        <div>
            <h1>API Performance Comparison</h1>
            <FetchProductsButton />
            {/* You can add more buttons here for creating, updating, deleting products */}
        </div>
    );
};

export default HomePage;