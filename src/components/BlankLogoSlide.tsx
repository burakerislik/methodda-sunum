import { MethoddaLogo } from "@/components/MethoddaLogo";

interface BlankLogoSlideProps {
  slideNumber: number;
}

export function BlankLogoSlide({ slideNumber }: BlankLogoSlideProps) {
  return (
    <section className="flex h-full w-full items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center gap-10">
        <MethoddaLogo
          title={`Slide ${slideNumber} logo`}
          className="h-auto w-[min(56vw,820px)] object-contain"
        />
      </div>
    </section>
  );
}
