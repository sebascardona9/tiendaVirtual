import HeroSection       from "./sections/HeroSection"
import CategoryCards     from "./sections/CategoryCards"
import ProductsSection   from "./sections/ProductsSection"
import CandleTypesSection from "./sections/CandleTypesSection"

const HomePage = () => (
    <div className="w-full">
        <HeroSection />
        <CategoryCards />
        <ProductsSection />
        <CandleTypesSection />
    </div>
)

export default HomePage
