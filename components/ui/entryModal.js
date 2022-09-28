import { useState, useEffect } from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  //   border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "1em",
  p: 4,
  height: 600,
  display: "flex",
  flexDirection: "column",
};

export default function EntryModal(props) {
  const { open, setOpen, handleOpen, handleClose, trade } = props;

  const [formValues, setFormValues] = useState({
    source: "",
    text: "",
  });

  const fields = {
    source: {
      placeholder: "Source",
    },
    text: {
      placeholder: "Comment",
      minRows: 4,
    },
  };

  const handleSubmit = async () => {
    try {
      const values = {
        ...formValues,
        ticker: trade.symbol,
        tradeDate: trade.date,
      };

      const { data } = await axios.post("/api/db/entry", values);

      setFormValues({
        source: "",
        text: "",
      });
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CloseOutlinedIcon onClick={handleClose} />
          {Object.keys(fields).map((field) => {
            return (
              <TextField
                key={field}
                id={field}
                name={field}
                value={formValues.field}
                onChange={(e) => {
                  setFormValues({
                    ...formValues,
                    [e.target.name]: e.target.value,
                  });
                }}
                multiline={field === "text"}
                placeholder={fields[field].placeholder}
                minRows={field === "text" ? fields[field].minRows : null}
              ></TextField>
            );
          })}
          <Button onClick={handleSubmit}>
            <Typography>Submit</Typography>
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
