import {
  DisconnectButtonProps,
  useDisconnectButton,
} from "@livekit/components-react";
import React from "react";
import styles from "./styles.module.css";
import { XMarkIcon } from "../../assets/icons";

export const DisconnectButton: React.FC<DisconnectButtonProps> =
  function DisconnectButton(props: DisconnectButtonProps) {
    const { buttonProps } = useDisconnectButton(props);
    return (
      <button {...buttonProps} className={styles.button}>
        <XMarkIcon width={24} height={24} color="#212121CC" />
      </button>
    );
  };
