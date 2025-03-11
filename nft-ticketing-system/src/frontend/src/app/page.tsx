import Navigation from "@/components/Navigation";
import Carousel from "@/components/Carousel";
import Events from "@/components/Events";
import Footer from "@/components/Footer";
export default function Home() {
  return (
    <div className="min-h-screen hide-scrollbar">
      <Navigation />
      <div className="py-8 md:px-36">
        <div>
          <p className="text-xl font-bold mb-8">Upcoming Events</p>
          <Carousel />
        </div>
        <div>
          <p className="text-xl font-bold mb-8">Available Events</p>
          <Events />
        </div>
      </div>
      <Footer />
    </div>
  );
}
