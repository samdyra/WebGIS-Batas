import Grid from './grid';
import { WobbleCard } from './wobbleCard';
function Home() {
  return (
    <>
      {/* <div className="w-32 h-32 bg-main-red">Landing page</div>
      <div className="w-32 h-32 bg-main-red">deskripsi singkat</div>
      <div className="w-32 h-32 bg-main-red">deskripsi singkat</div>
      <div className="w-32 h-32 bg-main-red">infografis dikit</div>
      <div className="w-32 h-32 bg-main-red">artikel2</div>
      <div className="w-32 h-32 bg-main-red">galeri foto</div> */}
      <div className=" mx-auto bg-white text-white overflow-hidden ">
        <div className="flex gap-5  justify-center items-center  h-[75vh] max-w-screen-xl mx-auto  items-center  pt-0 lg:flex lg:flex-wrap lg:pt-4 relative">
          <div className="lg:w-3/6 z-50 bg-main-green p-10   rounded">
            <h2 className="max-w-xl lg:text-[4.2em] text-3xl font-bold leading-none  inline-block">Landing Page</h2>

            <p className="mt-6 max-w-2xl text-xl font-semibold text-[#404040]">
              Lorem ipsum urna, consectetur adipiscing elit. Urna risus hendrerit dignissim duis fringilla sit. Lacus
              porttitor neque ipsum.
            </p>
          </div>
          {/* <div className="w-[48%]">
            <div className="flex gap-5">
              <WobbleCard containerClassName="w-2/3">asdas</WobbleCard>
              <WobbleCard containerClassName="w-1/3">asdas</WobbleCard>
            </div>
            <WobbleCard containerClassName="mt-5">asdas</WobbleCard>
          </div> */}
          {/* <div className="mb-20 mt-44 hidden w-full flex-col lg:mt-12 lg:inline-block lg:w-3/6">
            <img src="/images/placeholder.png" alt="Hero" />
          </div>
          <div className="my-20 inline-block w-full flex-col lg:mt-0 lg:hidden lg:w-2/5">
            <img src="/images/placeholder.png" alt="image" />
          </div> */}
          <Grid />
        </div>
      </div>

      <section className="w-full bg-main-green ">
        <div className="mt-0 bg-white lg:mt-40">
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
                mb-40
                hidden
                w-5/6
                rounded object-cover
                object-center
                lg:inline-block 
                lg:w-4/6
              "
                src="/images/placeholder.png"
                alt="img"
              />

              <img
                className="
              mb-24
              inline-block
              w-5/6
              rounded
              object-cover object-center
              lg:hidden
              lg:w-4/6 
            "
                src="/images/placeholder.png"
                alt="img"
              />
            </div>
          </div>
          <div className="mx-auto">
            <div className="mx-auto px-5 py-24 lg:px-24">
              <div className="my-10 flex w-full flex-col text-center">
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
                <div className="hidden items-center justify-center lg:inline-block">1000</div>
                <div className="hidden items-center justify-center lg:inline-block">1000</div>
                <div className="flex items-center justify-center">1000</div>
                <div className="flex items-center justify-center">1000</div>
                <div className="hidden items-center justify-center lg:inline-block">1000</div>
                <div className="hidden items-center justify-center lg:inline-block">1000</div>
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
        </div>

        <div className="mx-auto px-5 pt-32 pb-24 lg:px-24 text-white">
          <div className="my-3 flex w-full flex-col text-left lg:text-center">
            <h2 className="bold mb-8 text-4xl font-bold leading-tight  lg:text-6xl">
              Lorem ipsum elit sit unar, <br className="hidden lg:inline-block" />
              consectetur adipiscing elit.
            </h2>
          </div>

          <div className="flex w-full flex-row justify-center pt-24 text-center">
            <a href="/" className="underline-blue px-8 text-xl font-semibold text-black">
              Ut eleifend.
            </a>
            <a href="/" className="underline-gray px-6 text-xl font-semibold text-gray-700">
              Tempus in.
            </a>
          </div>
        </div>

        <div className="invisible mx-auto flex max-w-6xl p-3 pb-32 lg:visible lg:px-2">
          <img src="/images/placeholder.png" alt="img" />
        </div>

        <div className="bg-white text-black">
          Artikel
          <div className="my-24 p-4 text-black">
            <div className="max-w-9xl mx-auto flex flex-col items-center bg-gradient-to-r from-main-blue to-main-blue px-5 py-24 lg:flex-row">
              <div className="flex flex-col items-center pb-16 pl-0 text-center lg:mb-0 lg:w-1/2 lg:flex-grow lg:items-start lg:pl-12 lg:pr-24 lg:text-left">
                <h2 className="pb-4 text-2xl font-bold leading-tight lg:text-4xl">
                  Lorem ipsum mi at amet, consecteturadipiscing elit. Mattis.
                </h2>
                <p className="text-md mb-8 lg:text-xl">
                  Lorem ipsum praesent amet, consectetur adipiscing elit. Cursus ullamcorper id tristique tincidunt.
                  Tincidunt feugiat at mi feugiat hendrerit. Ac faucibus accumsan, quis lacus, lectus eget bibendum. At
                  praesent quisque sollicitudin fusce.
                </p>
              </div>
              <div className="w-4/7 pr-12 lg:w-2/5">
                <img
                  src="/images/placeholder.png"
                  className="hidden object-cover object-center lg:inline-block"
                  alt="image"
                />
                <img
                  src="/images/placeholder.png"
                  className="inline-block object-cover object-center lg:hidden"
                  alt="image"
                />
              </div>
            </div>
          </div>
          <div className="mx-auto">
            <div className="max-w-screen-xl mx-auto px-5 py-24 lg:px-24">
              <div className="my-6 flex w-full flex-col text-left lg:text-center">
                <h3 className="mb-8 text-5xl font-bold text-black">Dui tellus quis magna id ultricies eu sed.</h3>
                <h3 className="mb-12 px-0 text-lg font-semibold text-gray-900 lg:px-52">
                  Lorem ipsum accumsan arcu, consectetur adipiscing elit. Aliquet vestibulum molestie amet, maecenas id
                  amet. Ipsum accumsan arcu, aenean viverra penatibus quis. Laoreet.
                </h3>
              </div>
              <img src="/images/placeholder.png" alt="img" />
            </div>
          </div>
          <div className="text-black">
            <div className="max-w-screen-xl mx-auto flex flex-col px-5 py-48 text-black lg:flex-row">
              <div className="lg:mb-0 lg:w-full lg:max-w-xl">
                <img className="rounded object-cover object-center" alt="image" src="/images/placeholder1.png" />
              </div>
              <div className="items-left flex flex-col pt-16 text-left lg:w-1/2 lg:flex-grow lg:items-start lg:pl-32 lg:text-left">
                <h2 className="mb-2 text-lg leading-tight text-gray-700 sm:text-lg">
                  Viverra enim diam gravida risus nisl.
                </h2>
                <h2 className="mb-6 text-lg font-bold sm:text-lg">Lectus eu.</h2>
                <h2 className="mb-4 text-3xl font-bold sm:text-3xl">
                  Lorem ipsum accumsan arcu, consectetur adipiscing elit. Sed eget enim vel.
                </h2>
                <a href="/" className="underline-blue mt-12 text-lg font-bold leading-relaxed">
                  Ut convallis massa.
                </a>
              </div>
            </div>
          </div>
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
