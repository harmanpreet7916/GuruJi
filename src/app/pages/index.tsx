import Navbar from '../components/Navbar';
import ProductPage from '../components/Product';
import Homes from '../components/Image';
export default function Home() {

  return (
    <main className="w-screen min-h-screen items-center justify-between bg-white text-black">
      <div className=''>
        <Navbar />
      </div>
      <div className='overflow-x-hidden w-full overflow-hidden'>
        {/* <ProductPage /> */}
        <Homes/>
      </div>

    </main>
  );
}
