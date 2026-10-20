import Nav from './components/Nav.jsx'
import HeroSignature from './components/HeroSignature.jsx'
import NewFlavour from './components/NewFlavour.jsx'
import Menu from './components/Menu.jsx'
import Bubuk from './components/Bubuk.jsx'
import Tentang from './components/Tentang.jsx'
import Tanya from './components/Tanya.jsx'
import Footer from './components/Footer.jsx'
import ChatWidget from './components/ChatWidget.jsx'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <HeroSignature />
        <NewFlavour />
        <Menu />
        <Bubuk />
        <Tentang />
        <Tanya />
      </main>
      <Footer />
      <ChatWidget />
    </>
  )
}
