import { addStyle, toConfig, runExtension, createButtonObserver, getUidsFromButton, getTreeByBlockUid } from "roam-client";
import { createConfigObserver } from "roamjs-components";
import { renderStartRating } from "./StarRating";

addStyle(`
.roam-star-rating {
  display: flex;
}

.roam-star-rating-star {
  cursor: pointer;
  width: 2em;
  height: 2em;
  fill: none;
  stroke: black;
}

.roam-star-rating-star-active {
    fill: yellow
}

`);

const ID = "star-rating";
const CONFIG = toConfig(ID);
runExtension(ID, () => {

  createConfigObserver({
    title: CONFIG,
    config: {
      tabs: [
        {
          id: "import",
          fields: [
            {
              type: "multitext",
              title: "calendars",
              description:
                'The calendar ids to import events from. To find your calendar id, go to your calendar settings and scroll down to "Integrate Calendar".',
              defaultValue: ["dvargas92495@gmail.com"],
            },
            {
              type: "flag",
              title: "include event link",
              description:
                "Whether or not to hyperlink the summary with the event link. Ignored if 'format' is specified.",
            },
            {
              type: "flag",
              title: "skip free",
              description:
                "Whether or not to filter out events marked as 'free'",
            },
            {
              type: "text",
              title: "format",
              description:
                "The format events should output in when imported into Roam",
            },
          ],
        },
      ],
    },
  });

  createButtonObserver({
    shortcut: "star-rating",
    attribute: "rating-button",
    render: (b: HTMLButtonElement) => {
      const { blockUid } = getUidsFromButton(b);
      const tree = getTreeByBlockUid(blockUid);
      const initialValueNode = tree.children.find(
        (c) => !isNaN(parseInt(c.text))
      );
      const initialValue = initialValueNode
        ? parseInt(initialValueNode.text)
        : 0;
        renderStartRating(initialValue, initialValueNode.uid, b.parentElement);
    },
  });

});
