import { GLOBAL_ICON_SCALE, namespace } from '../../App';
import SongItem from '../song/SongItem';
import InfiniteScroller from '../InfiniteScroller';
import { createSignal, onCleanup, onMount } from 'solid-js';
import ResetSignal from '../../lib/ResetSignal';
import Fa from 'solid-fa';
import { faShuffle } from '@fortawesome/free-solid-svg-icons';
import { Optional, Song } from '../../../../@types';
import { none, some } from '../../lib/rust-like-utils-client/Optional';



const QueueView = () => {
  const [count, setCount] = createSignal(0);
  const listingReset = new ResetSignal();
  let view;

  const onSongsLoad = async () => {
    if (view === undefined) {
      return;
    }

    const song = await window.api.request("queue.current");
    const opt = changeSongHighlight(song);

    if (opt.isNone) {
      return;
    }

    const container = opt.value;

    container.classList.add("selected");
    const list = container.closest(".list");

    if (list === null) {
      return;
    }

    list.scrollTo(0, container.offsetTop);
  };

  const changeSongHighlight = (song: Song): Optional<HTMLElement> => {
    if (view === undefined) {
      return none();
    }

    const selected = view.querySelector(".song-item.selected");
    if (selected !== null && selected.dataset.path !== song.path) {
      selected.classList.remove("selected");
    }

    const path = song.path
      .replaceAll('"', '\\"')
      .replaceAll('\\', '\\\\');
    const element = view.querySelector(`.song-item[data-path="${path}"]`);
    element?.classList.add("selected");

    if (element === null) {
      return none();
    }

    return some(element);
  };

  const changeSongListener = (song: Song) => {
    changeSongHighlight(song);
  };

  onMount(() => {
    window.api.listen("queue.created", listingReset.reset.bind(listingReset));
    window.api.listen("queue.songChanged", changeSongListener);
  });

  onCleanup(() => {
    window.api.removeListener("queue.created", listingReset.reset.bind(listingReset));
    window.api.removeListener("queue.songChanged", changeSongListener);
  });

  return (
    <div
      ref={view}
      class="song-view"
      data-item-group={namespace.create(true)}
    >
      <div>
        <span>Queue [listening to {count()} songs]</span>
        <button>
          <Fa icon={faShuffle} scale={GLOBAL_ICON_SCALE}/>
        </button>
      </div>

      <InfiniteScroller
        apiKey={"query.queue"}
        initAPIKey={"query.queue.init"}
        setResultCount={setCount}
        reset={listingReset}
        onSongsLoad={onSongsLoad}
        fallback={<div>No queue...</div>}
        builder={s =>
          <SongItem song={s} onSelect={async (...args) => console.log(...args)} selectable={true}/>
        }
      />
    </div>
  )
}



export default QueueView;