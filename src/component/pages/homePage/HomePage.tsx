import HeroSection       from "./sections/HeroSection"
import CategoryCards     from "./sections/CategoryCards"
import ProductsSection   from "./sections/ProductsSection"
import CandleTypesSection from "./sections/CandleTypesSection"
import ReviewsSection    from "./sections/ReviewsSection"

const HomePage = () => (
    <div className="w-full">
        <HeroSection />
        <CategoryCards />
        <ProductsSection />
        <CandleTypesSection />
        <ReviewsSection />
    </div>
)

export default HomePage
