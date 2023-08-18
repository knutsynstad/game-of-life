import { Devvit } from '@devvit/public-api';
import { GameOfLife } from './GameOfLife.js';

Devvit.configure({
  redditAPI: true,
});

Devvit.addMenuItem({
  label: 'Create Game of Life post',
  location: 'subreddit',
  onPress: async (_, { reddit, ui }) => {
    const { name } = await reddit.getCurrentSubreddit();
    await reddit.submitPost({
      preview: <></>,
      title: "Conway's Game of Life",
      subredditName: name,
    });
    ui.showToast("Post created");
  },
});

Devvit.addCustomPostType({
  name: 'game-of-life',
  render: GameOfLife,
});

export default Devvit;
