import Grid from './grid';
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';
import Article from './article';
import Gallery from './gallery/gallery';
import FAQ from './faq'; //eslint-disable-line
import CarouselFeatures from './carouselFeature';

function Home() {
  return (
    <>
      {/* <div className="w-32 h-32 bg-main-red">Landing page</div>
      <div className="w-32 h-32 bg-main-red">deskripsi singkat</div>
      <div className="w-32 h-32 bg-main-red">deskripsi singkat</div>
      <div className="w-32 h-32 bg-main-red">infografis dikit</div>
      <div className="w-32 h-32 bg-main-red">artikel2</div>
      <div className="w-32 h-32 bg-main-red">galeri foto</div> */}
      <div className=" mx-auto bg-main-green text-white overflow-hidden ">
        <div className="flex gap-5  justify-center  h-[720px] max-w-screen-xl mx-auto  items-center  pt-0 lg:flex lg:flex-wrap lg:pt-4 relative">
          <div className="lg:w-3/6 z-50  p-10 text-center  rounded">
            <h2 className="max-w-xl lg:text-[4.2em] text-3xl font-bold leading-none  inline-block">Landing Page</h2>

            <p className="mt-6 max-w-2xl text-xl font-semibold text-[#404040]">
              Lorem ipsum urna, consectetur adipiscing elit. Urna risus hendrerit dignissim duis fringilla sit. Lacus
              porttitor neque ipsum.
            </p>
          </div>

          <Grid />
          <img
            src="contour.png"
            className="absolute opacity-20 inset-0 object-cover object-center w-full h-full z-0 "
          />
        </div>
      </div>

      <div className="w-4/5  py-20 h-fit drop-shadow-lg  bg-white rounded-xl absolute z-10 top-[550px] left-1/2 translate-x-[-50%]  ">
        <div className="text-black">
          <div
            className="
              max-w-9xl
              mx-auto
              flex
              flex-col
              items-center
              justify-center
              px-5
            "
          >
            <div className="mr-0 mb-6 w-full py-4 text-center lg:w-2/3">
              <h2 className="mb-4 text-4xl font-bold sm:text-5xl">Sem enim cursus orci at.</h2>
              <p className="mb-4 text-lg leading-relaxed">
                In ullamcorper magna nunc, non molestie augue feugiat eget. Mauris, vitae et, vitae et cursus amet
                tincidunt feugiat nulla. Senectus maecenas diam risus sodales dictum eu. Eget cursus sit bibendum
                pulvinar faucibus vitae nam sed. Faucibus vel laoreet.
              </p>
              <a href="/" className="underline-blue font-semibold">
                Learn more
              </a>
            </div>
            <img
              className="
                lg:w-5/7
                mb-10
               
                w-5/6
                rounded object-cover
                object-center
                lg:inline-block 
                lg:w-4/6
              "
              src="/webgis.png"
              alt="img"
            />
          </div>
        </div>
      </div>

      <section className="w-full  mt-[800px] 2xl:mt-[900px] ">
        <div className="mt-0 bg-white ">
          <div className="mx-auto px-5  lg:px-24 rounded-xl bg-white my-44  w-4/5">
            <div className="my-10 flex w-full flex-col text-center  ">
              <h2 className="mb-5 text-2xl font-bold text-black lg:text-3xl">
                In ullamcorper magna nunc, non molestie augue feugiat eget.
              </h2>
            </div>
            <div
              className="
                grid grid-cols-2
                gap-16
                text-center
                lg:grid-cols-6
                font-extrabold
                text-4xl
                text-main-green-dark"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className=" items-center justify-center lg:inline-block">
                  <CountUp end={246 * index + 245} redraw={true}>
                    {({ countUpRef, start }) => (
                      <VisibilitySensor onChange={start} delayedCall>
                        <span ref={countUpRef} />
                      </VisibilitySensor>
                    )}
                  </CountUp>
                </div>
              ))}
            </div>
            <div className="my-12 flex w-full flex-col pl-8 text-center">
              <a
                href="/"
                className="
                  underline-blue
                  mb-8
                  mt-6
                  text-xl
                  font-bold
                  text-black
                "
              >
                Ut eleifend.
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto px-5 pt-32 pb-24 lg:px-24 text-white bg-main-green">
          <div className="my-3 flex w-full flex-col text-center">
            <h2 className="bold mb-8 text-4xl font-bold leading-tight  lg:text-6xl">
              Lorem ipsum elit sit unar, <br className="hidden lg:inline-block" />
              consectetur adipiscing elit.
            </h2>
          </div>

          <div className="flex w-full flex-row justify-center pb-24 text-center">
            <a href="/" className="underline-blue px-8 text-xl font-semibold text-white">
              Ut eleifend.
            </a>
            <a href="/" className="underline-gray px-6 text-xl font-semibold text-main-yellow">
              Tempus in.
            </a>
          </div>
          <div className=" mx-auto flex max-w-6xl p-3 pb-32 lg:visible lg:px-2">
            <img src="/webgis1.png" alt="img" />
          </div>
        </div>

        <Article />
        <CarouselFeatures />

        <FAQ />
        <div className="w-4/5  mx-auto">
          <Gallery />
        </div>
      </section>

      <footer className=" bg-main-green">
        <div className="max-w-screen-xl mx-auto px-5 py-24 text-white">
          <div className="order-first flex flex-wrap text-left">
            <div className="w-full px-4 md:w-2/4 lg:w-1/5">
              <h2 className="mb-3 text-lg tracking-widest">Est.</h2>
              <nav className="list-none space-y-2 py-3">
                <li>
                  <a href="/">Vitae nec.</a>
                </li>
                <li>
                  <a href="/">Purus</a>
                </li>
                <li>
                  <a href="/">Nibh.</a>
                </li>
                <li>
                  <a href="/">Proin semper justo.</a>
                </li>
                <li>
                  <a href="/">Blandit.</a>
                </li>
                <li>
                  <a href="/">Malesuada.</a>
                </li>
              </nav>
            </div>
            <div className="w-full px-4 md:w-2/4 lg:w-1/5">
              <h2 className="mb-3 text-lg tracking-widest">Et.</h2>
              <nav className="mb-10 list-none space-y-2 py-3">
                <li>
                  <a href="/">Ninc elementum.</a>
                </li>
                <li>
                  <a href="/">Sit ac interdum</a>
                </li>
                <li>
                  <a href="/">Ac ut cras.</a>
                </li>
                <li>
                  <a href="/">Sed ipsum lobortis.</a>
                </li>
                <li>
                  <a href="/">Nulla maecenas nunc.</a>
                </li>
                <li>
                  <a href="/">Purus</a>
                </li>
              </nav>
            </div>
            <div className="w-full px-4 md:w-2/4 lg:w-1/5">
              <h2 className="mb-3 text-lg tracking-widest">Placerat.</h2>
              <nav className="mb-10 list-none space-y-2 py-3">
                <li>
                  <a href="/">Et cursus fringilla.</a>
                </li>
                <li>
                  <a href="/">In velit sagittis.</a>
                </li>
                <li>
                  <a href="/">Mattis.</a>
                </li>
                <li>
                  <a href="/">Est.</a>
                </li>
              </nav>
            </div>
            <div className="w-full px-4 md:w-2/4 lg:w-1/5">
              <h2 className="mb-3 text-lg tracking-widest">Messa.</h2>
              <nav className="mb-10 list-none space-y-2 py-3">
                <li>
                  <a href="/">Id.</a>
                </li>
                <li>
                  <a href="/">Aliquam.</a>
                </li>
                <li>
                  <a href="/">Interdum.</a>
                </li>
                <li>
                  <a href="/">Risus.</a>
                </li>
              </nav>
            </div>
            <div className="w-full md:w-2/4 lg:w-1/5">
              <a href="/">
                <div className="relative border border-white transition hover:border-gray-500">
                  <div className="absolute top-0 right-0 pt-2 pr-2">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.66992 0.747559L0.669922 6.74756" stroke="black" />
                      <path d="M0.669922 0.747559H6.66992V6.74756" stroke="black" />
                    </svg>
                  </div>
                  <div className="p-6">Lorem ipsum accumsan arcu, consectetur adipiscing elit. Consequat arcu.</div>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className="px-2">
          <div className="max-w-screen-xl mx-auto px-5 py-6 text-white">
            <h2 className="">Diam egestas ultrices odio vitae.</h2>
            <div>
              <h2 className="my-4 text-sm">
                Lorem ipsum accumsan arcu, consectetur adipiscing elit. Dolor proin tempor sed fermentum sit{' '}
                <br className="hidden lg:inline-block" /> pretium pellentesque. Dictumst risus elementum dignissim
                risus, lobortis molestie.
              </h2>
            </div>
            <div className="absolute right-0 -mt-24 hidden lg:inline-block">
              <a href="/" className="mr-16">
                Terms & Conditions
              </a>
              <a href="/" className="mr-16">
                Privacy Policy
              </a>
              <a href="/" className="mr-16">
                Cookie Policy
              </a>
            </div>
            <div className="right-0 inline-block pt-12 pb-6 pr-20 text-sm  md:hidden">
              <a href="/" className="mr-16">
                Terms & Conditions
              </a>
              <a href="/" className="mr-16">
                Privacy Policy
              </a>
              <a href="/" className="mr-16">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;
