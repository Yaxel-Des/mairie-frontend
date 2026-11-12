import useEmblaCarousel from 'embla-carousel-react';
import { getMediaItems } from '../data/api';

type ProjectImageCarouselProps = {
  images: unknown;
  projectTitle: string;
};

export default function ProjectImageCarousel({ images, projectTitle }: ProjectImageCarouselProps) {
  const mediaItems = getMediaItems(images);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: mediaItems.length > 1 });

  if (mediaItems.length === 0) {
    return (
      <p className="mb-5 border border-mairie-line bg-mairie-mist px-4 py-3 text-sm text-mairie-muted" role="status">
        Aucune image disponible.
      </p>
    );
  }

  return (
    <div className="mb-5">
      <div className="overflow-hidden border border-mairie-line" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {mediaItems.map((media, index) => (
            <div className="min-w-0 flex-[0_0_100%]" key={`${media.url}-${index}`}>
              <img
                src={media.url}
                alt={media.alternativeText || `${projectTitle || 'Projet communal'} — image ${index + 1}`}
                className="aspect-[16/9] w-full object-cover"
                width="960"
                height="540"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
      {mediaItems.length > 1 && (
        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            className="inline-flex min-h-11 items-center gap-2 border border-mairie-gold px-3 text-sm font-semibold text-mairie-brown hover:bg-mairie-goldSoft focus-visible:outline-mairie-lagoon"
            aria-label="Image précédente"
            onClick={() => emblaApi?.scrollPrev()}
          >
            <span aria-hidden="true">←</span>
            Précédent
          </button>
          <button
            type="button"
            className="inline-flex min-h-11 items-center gap-2 border border-mairie-gold px-3 text-sm font-semibold text-mairie-brown hover:bg-mairie-goldSoft focus-visible:outline-mairie-lagoon"
            aria-label="Image suivante"
            onClick={() => emblaApi?.scrollNext()}
          >
            Suivant
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
