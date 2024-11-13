import {
  DisconnectButtonProps,
  useDisconnectButton,
} from "@livekit/components-react";
import React from "react";
import { XMarkIcon } from "../../assets/icons";
import styles from "./styles.module.css";

export const DisconnectButton: React.FC<DisconnectButtonProps> =
  function DisconnectButton(props: DisconnectButtonProps) {
    const { buttonProps } = useDisconnectButton(props);
    const { className } = props;
    return (
      <button {...buttonProps} className={`${styles.button} ${className}`}>
        <XMarkIcon width={24} height={24} color="#212121CC" />
      </button>
    );
  };
