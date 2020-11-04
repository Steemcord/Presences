#### In order to publish a presence, you need to know [how to make one first](https://github.com/Steemcord/Presences/wiki/Creating-a-Presence).

## Guidelines
In order to create a presence for a Steam game: (subject to change)
- The app must not already have Discord rich presence.
- The app **must** output rich presence.

### Metadata
Same rules apply from the `Creating a Presence` wiki page, **except**:
- `update_url` and `script_url` must be removed.
- `author.avatar` and `author.url` must be removed (along with contributors).
- You must fill out `author.name` and `author.github` (along with contributors).
- `$schema` is required.
- `description` is required. You can copy straight from the app's Steam store page if you need to.
- `icon` is **recommended**. If a user does not have the game and the presence does not have the icon, then the icon will be replaced with a generic game controller.
- `version` must start with `1.0.0` and not be suffixed. (i.e. `-beta`)

### Script
- **Always** declare a new instance of the `Presence` class before any other variable to avoid rare issues that may occur; this is not a requirement by design so it could be removed in the future.
- **Always** include `module` in the presence options object in order for the presence to work
- **Do not** set fields in the presence data object to `undefined` after it has been declared, use the delete keyword instead. (for e.g., `use delete data.startTimestamp` instead of `data.startTimestamp = undefined`)
- Presence text must be in English. (subject to change)
- **Presence text must not be unrelated to the game itself.**

## Pull Request
### Creation
Always make sure to start your presence in the most appropriate folder, if its name starts with any Latin letter then it must be under its alphabetical match (for e.g., `G/Garry's Mod` or `T/Tower Unite`). Any other Unicode/non-Latin characters must be under the # folder (for e.g., `#/日日夜夜`) and numbers under the 0-9 folder (for e.g., `0-9/9th Dawn III`).
```
Steemcord/Presences
├── presences
│   ├── G
│   │   ├── Garry's Mod
│   │   │   ├── metadata.json
│   │   │   └── index.ts
```

### Review
- It takes one reviewer to merge a pull request.
- All checks must be passed in order to merge.
- Pull Requests inactive for more than 2 weeks are considered stale and will be closed.
- You must provide new, unaltered screenshots (taken by you) showing a side-by-side comparison of your profile and the game to prove that your presence works. You are allowed to stitch screenshots together for viewing pleasure. This applies for both creation and modification.

### Presence Updating & Ownership
- In order to update a presence, you must be the creator of the presence or have permission from the creator of the presence (via comment) in order for the pull request to be valid.
- If you make modify at least a fifth of the code to a presence, you can add yourself as a contributor.
- Do not make meaningless changes to a presence. You can fix typos, small bugs and small additions. Do not change images unless they are outdated.

# Reviewers

|||
|-|-|
| ![a](https://github.com/Snazzah.png?size=48) | [Snazzah](https://github.com/Snazzah) |