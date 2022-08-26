# Melatonin Bot

A discord bot that tells users to go to bed.

Quick Start
-----------

1. Install node and yarn
2. Clone the repository
3. Run `yarn install`
4. Create a file called `config.json` in the `auth` directory
5. Add the following to the `config.json` file:

```
{
  "token": "YOUR_TOKEN_HERE"",
  "timeout": 60000, // Timeout for each check in milliseconds
  "messages": [
    "Go to sleep, you're not doing anything important.",
    "You're not doing anything important.",
    "Go take some melatonin",
    "Why are you still up?",
    "Why are you doing this?" // Add more messages here
  ]
}
```

6. Run `yarn start`
7. Add yourself to the bot monitor list by running `!add` in a channel the bot has access to
8. To remove yourself from the bot monitor list, run `!remove` in a channel the bot has access to

Note that the bot will operate in the channel you run the `!add` command in.
If you want to add the bot to a different channel, first run the `!remove` command to remove
yourself from the bot monitor list and then run the `!add` command in the channel you want the
bot to operate in.

License
-------
This project is licensed under the GNU General Public License v3.0.
See the [LICENSE.md](LICENSE.md) file for more details.
