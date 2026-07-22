import { FlickerSpinner } from 'flicker-dot';
import { michaelGrids } from '../data/grids';

const LETTERS = ['M', 'I', 'C', 'H', 'A', 'E', 'L'];

export default function BigM() {
  return (
    <section className="big-m" aria-hidden="true">
      <div className="big-m-row">
        {michaelGrids.map((grids, i) => (
          <div key={LETTERS[i]} className="big-m-cell">
            <FlickerSpinner
              grids={grids}
              onColor="#F5F5F5"
              offColor="#000000"
              size={84}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
