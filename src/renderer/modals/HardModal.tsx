import React, { Ref, useRef, useCallback } from "react";
import styled from "styled-components";
import { fontSizes } from "renderer/theme";
import { IconButton } from "renderer/basics/IconButton";
import { useResizeObserver } from "renderer/use-resize-observer";

const HardModalDiv = styled.div`
  border: 1px solid ${p => p.theme.colors.shellBorder};
  min-width: 450px;
  min-height: 150px;

  background: #fa5c5c;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const HardModalTitleDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-basis: 2em;

  h3 {
    -webkit-app-region: drag;
    font-size: ${fontSizes.normal};
    flex-grow: 1;
    text-align: center;
  }
`;

const HardModalContent = styled.div`
  padding: 15px;
  padding-top: 40px;
  overflow-y: auto;
  flex-grow: 1;

  p {
    padding-bottom: 1.2em;
  }
`;

const HardModalButtons = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  flex-shrink: 0;
  padding-top: 15px;

  button {
    margin-right: 1em;

    &:last-of-type {
      margin-right: 0;
    }
  }
`;

interface Props {
  title?: React.ReactNode;
  content?: React.ReactNode;
  buttons?: React.ReactNode;
  className?: string;
}

export const HardModal = (props: Props) => {
  const titleHeight = useRef(0);
  const contentHeight = useRef(0);
  const buttonsHeight = useRef(0);

  const measure = useCallback(() => {
    console.log("should measure: ", {
      titleHeight: titleHeight.current,
      contentHeight: contentHeight.current,
      buttonsHeight: buttonsHeight.current,
    });
  }, []);

  const titleRef = useResizeObserver({
    onResize: useCallback(
      (_width, height) => {
        titleHeight.current = height;
        measure();
      },
      [measure]
    ),
  });
  const contentRef = useResizeObserver({
    onResize: useCallback(
      (_width, height) => {
        titleHeight.current = height;
        measure();
      },
      [measure]
    ),
  });
  const buttonsRef = useResizeObserver({
    onResize: useCallback(
      (_width, height) => {
        buttonsHeight.current = height;
        measure();
      },
      [measure]
    ),
  });

  return (
    <HardModalDiv className={props.className}>
      <HardModalTitleDiv ref={titleRef}>
        <h3>{props.title}</h3>
        <IconButton icon="cross" onClick={() => window.close()} />
      </HardModalTitleDiv>
      <HardModalContent>
        <div ref={contentRef}>{props.content}</div>
      </HardModalContent>
      <HardModalButtons ref={buttonsRef}>{props.buttons}</HardModalButtons>
    </HardModalDiv>
  );
};
