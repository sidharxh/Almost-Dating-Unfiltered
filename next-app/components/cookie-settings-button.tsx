'use client';

import {cookieSettingsEvent} from '@/components/analytics';

export default function CookieSettingsButton() {
  return <button className="button outline" type="button" onClick={()=>window.dispatchEvent(new Event(cookieSettingsEvent))}>Change cookie choice</button>;
}
