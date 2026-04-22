import type { Dispatch, SetStateAction } from "react";
import { Icons } from "./Icons";

export type Theme = 'light' | 'dark';
export type Density = 'comfortable' | 'compact';

export interface Tweaks {
  theme: Theme;
  density: Density;
}

type Props = {
  tweaksOn: boolean;
  tweaks: Tweaks
  setTweaksOn: Dispatch<SetStateAction<boolean>>;
  applyTweak: <K extends keyof Tweaks>(k: K, v: Tweaks[K]) => void;
}

export const TweaksPanel = ({
  tweaksOn,
  tweaks,
  applyTweak,
  setTweaksOn
}: Props) => {

  return <div className={'tweaks' + (tweaksOn ? ' is-on' : '')}>
    <h4>
      Tweaks
      <button className="btn btn--ghost btn--sm" onClick={() => setTweaksOn(false)} style={{ padding: 0 }}>
        {Icons.x}
      </button>
    </h4>
    <div className="tweak">
      <span className="tweak__name">Theme</span>
      <div className="tweak__ctl">
        <button className={'tweak__opt' + (tweaks.theme === 'light' ? ' is-on' : '')} onClick={() => applyTweak('theme', 'light')}>
          Light
        </button>
        <button className={'tweak__opt' + (tweaks.theme === 'dark' ? ' is-on' : '')} onClick={() => applyTweak('theme', 'dark')}>
          Dark
        </button>
      </div>
    </div>
    <div className="tweak">
      <span className="tweak__name">Density</span>
      <div className="tweak__ctl">
        <button className={'tweak__opt' + (tweaks.density === 'comfortable' ? ' is-on' : '')} onClick={() => applyTweak('density', 'comfortable')}>
          Comfort
        </button>
        <button className={'tweak__opt' + (tweaks.density === 'compact' ? ' is-on' : '')} onClick={() => applyTweak('density', 'compact')}>
          Compact
        </button>
      </div>
    </div>
  </div>
}

export const TwicksSection = (props: Props) => {
  return <>
    <button
      className="btn btn--sm"
      style={{ position: 'fixed', right: 24, bottom: props.tweaksOn ? 188 : 24, zIndex: 51, transition: 'bottom 200ms' }}
      onClick={() => props.setTweaksOn((o: boolean) => !o)}
    >
      {Icons.sliders}
    </button>

    <TweaksPanel
      {...props}
    />
  </>
}