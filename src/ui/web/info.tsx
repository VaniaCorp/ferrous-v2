import { TextUpAnimation } from "@/animations/text-animation";


export default function Info() {
  return (
    <div id="info" className="w-full max-w-7xl h-screen max-h-[50em] px-4 lg:px-16 mx-auto flex flex-col gap-12">
      <div className="leading-none max-md:space-y-1">
        <TextUpAnimation as="h1" className="!font-mono uppercase">
          Your <span className="yellow-underline">gateway </span><br />
        </TextUpAnimation>
        <TextUpAnimation as="h1" className="!font-mono uppercase">
          to a borderless <br />
        </TextUpAnimation>
        <TextUpAnimation as="h1" className="!font-mono uppercase">
          financial future.
        </TextUpAnimation>
      </div>

      <article className="w-full max-w-lg h-max max-h-96 overflow-y-auto flex flex-col gap-8">
        <p>
          <strong>Ferrous</strong> connects local currency from emerging markets to world class financial instruments built on the global blockchain 
          economy by eliminating the practical barriers and technical friction that previously made the opportunities inaccessible.
          Ferrous integrates key providers to offer you access to a selection of assets that were only available to institutions and seasoned investors.
        </p>
      </article>
    </div>
  )
}
