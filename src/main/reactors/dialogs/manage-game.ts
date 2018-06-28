import { actions } from "common/actions";
import { messages } from "common/butlerd/index";
import { Watcher } from "common/util/watcher";
import { mainLogger } from "main/logger";
import { modalWidgets } from "renderer/modal-widgets";
import { ManageGameParams } from "renderer/modal-widgets/ManageGame";
import { mcall } from "main/butlerd/mcall";

const logger = mainLogger.child(__filename);

export default function(watcher: Watcher) {
  watcher.on(actions.manageGame, async (store, action) => {
    const { game } = action.payload;

    const caves = (await mcall(messages.FetchCaves, {
      filters: { gameId: game.id },
    })).items;

    const widgetParams: ManageGameParams = {
      game,
      caves,
      allUploads: [],
      loadingUploads: true,
    };

    const openModal = actions.openModal(
      modalWidgets.manageGame.make({
        wind: "root",
        title: game.title,
        message: "",
        buttons: [
          {
            label: ["prompt.action.close"],
            className: "secondary",
          },
        ],
        widgetParams,
      })
    );
    store.dispatch(openModal);
    const modalId = openModal.payload.id;

    try {
      try {
        const { uploads } = await mcall(messages.GameFindUploads, { game });
        widgetParams.allUploads = uploads;
      } catch (e) {
        console.log(`Could not fetch compatible uploads: ${e.stack}`);
      }
    } catch (e) {
      logger.warn(`could not list uploads: ${e.message}`);
    } finally {
      widgetParams.loadingUploads = false;

      store.dispatch(
        actions.updateModalWidgetParams(
          modalWidgets.manageGame.update({
            id: modalId,
            widgetParams,
          })
        )
      );
    }
  });
}
