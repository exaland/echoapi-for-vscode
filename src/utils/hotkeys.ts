import { HOT_KEYS_COMBINATION_KEY } from "@/constants/hotkeys";
import { filter, keys, omit,concat,forEach,entries  } from "lodash";
import { HotkeysEvent } from "react-hotkeys-hook/dist/types";

const areShortcutsEqual = (shortcut: string, shortcutsArray: string[]) => {
  // Normalize a single shortcut string
  const normalizeShortcut = (str: string) => {
    return str
      .split('+')
      .map((key) => key.trim().toLowerCase())
      .sort()
      .join('+');
  };

  // Normalize the input string shortcut
  const normalizedShortcut = normalizeShortcut(shortcut);

  // Check if an equal normalized shortcut exists in the array
  return shortcutsArray.some((arrayShortcut) => {
    return normalizeShortcut(arrayShortcut) === normalizedShortcut;
  });
};

export const handleHotKeysEventAction = (
  hotkeysEvent: HotkeysEvent,
  hotKeysMap: { [x: string]: string[] }
) => {
  let action = 'unknown';
  const eventKeys = hotkeysEvent.keys;
  const modifiers = filter(
    keys(omit(hotkeysEvent, ['keys','hotkey'])),
    (filterKey: keyof HotkeysEvent) => !!hotkeysEvent[filterKey]
  );

  const finalKey = concat([], modifiers, eventKeys).join(HOT_KEYS_COMBINATION_KEY);
  
  forEach(entries(hotKeysMap), ([key, value]) => {
    if (areShortcutsEqual(finalKey, value)) {
      action = key;
    }
  });

  return action;
};