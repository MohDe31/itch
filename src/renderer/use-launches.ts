import { OngoingLaunches, OngoingLaunch } from "common/launches";
import { useSocket } from "renderer/contexts";
import { useState, useEffect } from "react";
import { queries } from "common/queries";
import { useListen } from "renderer/Socket";
import { packets } from "common/packets";
import _ from "lodash";
import { filterObject } from "common/filter-object";
import { useAsync } from "renderer/use-async";

export interface LaunchFilter {
  gameId?: number;
}

/**
 * Return ongoing launches, optionally filtered by something
 */
export function useLaunches(filter?: LaunchFilter): OngoingLaunches {
  const filterState = JSON.stringify(filter);

  const [launches, setLaunches] = useState<OngoingLaunches>({});
  const mergeLaunches = (fresh: OngoingLaunches) => {
    console.log(`merging fresh = `, fresh);
    setLaunches(old => ({
      ...old,
      ...filterObject(fresh, l => {
        if (filter?.gameId) {
          return l.gameId === filter.gameId;
        } else {
          return true;
        }
      }),
    }));
  };

  const socket = useSocket();
  useAsync(async () => {
    const { launches } = await socket.query(queries.getOngoingLaunches);
    mergeLaunches(launches);
  }, [socket, filterState]);

  useListen(
    socket,
    packets.launchChanged,
    ({ launchId, launch }) => {
      mergeLaunches({ [launchId]: launch });
    },
    [filterState]
  );
  useListen(
    socket,
    packets.launchEnded,
    ({ launchId }) => {
      setLaunches(old => (old[launchId] ? _.omit(old, launchId) : old));
    },
    [filterState]
  );

  return launches;
}
