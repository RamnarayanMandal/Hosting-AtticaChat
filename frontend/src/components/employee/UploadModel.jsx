import * as React from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { FaFolderPlus } from "react-icons/fa";
import { BASE_URL } from "../../constants";

export default function UploadModel({ selectedGroupName, selectedGrade }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false); // Add loading state
  const anchorRef = React.useRef(null);
  const imageInputRef = React.useRef(null);
  const documentInputRef = React.useRef(null);
  const videoInputRef = React.useRef(null);
  // console.log(selectedGroupName, selectedGrade);

  const employeeId = localStorage.getItem("EmployeeId");
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const handleFileInputClick = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange = async (event, fieldName) => {
    // Accept fieldName parameter
    const file = event.target.files[0];
    if (file) {
      // Create a FormData object to hold the file
      const formData = new FormData();
      formData.append(fieldName, file); // Use fieldName as the field name
      formData.append("group", selectedGroupName);
      formData.append("grade", selectedGrade);
      formData.append("employeeId", employeeId);

      setLoading(true); // Set loading to true before upload starts
      try {
        const response = await axios.post(
          `${BASE_URL}/api/empadminsender/createMessage`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("File uploaded successfully:", response.data);
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setLoading(false); // Set loading to false after upload completes
      }

      // Reset the input value to allow uploading the same file again if needed
      event.target.value = null;
    }
  };

  return (
    <Stack direction="row" spacing={2}>
      <div>
        <Button
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? "composition-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          sx={{
            height: "60px",
            width: "60px",
            minWidth: "unset",
            color: "purple",
          }}
        >
          <FaFolderPlus size={32} />
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem
                      onClick={() => handleFileInputClick(imageInputRef)}
                    >
                      Image
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleFileInputClick(documentInputRef)}
                    >
                      Document
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleFileInputClick(videoInputRef)}
                    >
                      Video
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleFileChange(e, "image")} // Pass 'image' as fieldName
        />
        <input
          ref={documentInputRef}
          type="file"
          accept="application/pdf"
          style={{ display: "none" }}
          onChange={(e) => handleFileChange(e, "document")} // Pass 'document' as fieldName
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          style={{ display: "none" }}
          onChange={(e) => handleFileChange(e, "video")} // Pass 'video' as fieldName
        />
      </div>
      {loading && <CircularProgress className="absolute top-1/2 left-1/2" />}{" "}
      {/* Show spinner when loading is true */}
    </Stack>
  );
}
