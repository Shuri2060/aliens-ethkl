# aliens-ethkl
👽👽👽

Basic PvP turn based fighting game implemented onchain. Game mechanics design is from one of the minigames of a Discord bot, Dank Memer. Mechanics are similar, but not necessarily exactly the same, as they are statistically reverse engineered.

- Each player has an HP and Armor stat. HP starts at max, Armor at 0.
- Random player goes first
- Turn player can:
  - Punch - light attack
  - Kick - heavy attack with a chance to fall
  - Defend - increase armor (up to max)
  - Run - give up

Raw Damage calculation:
- Punch will inflict random damage between min and max range
- Flip for success. Kick will inflict random damage between min and max range if success. If fail, it is a Fall and inflict half kick damage to self instead.

Armor:
- When inflicting damage, reduce damage by receiving player's armor. If this damage would become negative, inflict default damage instead.

When a player reaches 0 HP, they lose.