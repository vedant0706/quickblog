import Navbar from '../components/Navbar'
import Header from '../components/Header'
import BlogList from '../components/BlogList'
import NewsLetter from '../components/NewsLetter'
import Footer from '../components/Footer'

const Home = () => {
  
  return (
    <div className='bg-white text-black transition-colors duration-300'>
        <Navbar />
        <Header />
        <BlogList />
        <NewsLetter />
        <Footer />
    </div>
  )
}

export default Home