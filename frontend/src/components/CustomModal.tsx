import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

import { Item } from "../App";

interface Props {
  activeItem: Item;
  toggle: () => void;
  onSave: (item: Item) => void;
}

const CustomModal = (props: Props) => {
  const [activeItem, setActiveItem] = useState<Item>(props.activeItem);

  const { toggle, onSave } = props;
  return (
    <div>
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Todo Item</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="todo-title">Title</Label>
              <Input
                type="text"
                id="todo-title"
                name="title"
                value={activeItem.title}
                onChange={(e) =>
                  setActiveItem({ ...activeItem, title: e.currentTarget.value })
                }
                placeholder="Enter Todo Title"
              />
            </FormGroup>
            <FormGroup>
              <Label for="todo-description">Description</Label>
              <Input
                type="text"
                id="todo-description"
                name="description"
                value={activeItem.description}
                onChange={(e) =>
                  setActiveItem({
                    ...activeItem,
                    description: e.currentTarget.value,
                  })
                }
                placeholder="Enter Todo description"
              />
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  name="completed"
                  checked={activeItem.completed}
                  onChange={(e) =>
                    setActiveItem({
                      ...activeItem,
                      completed: e.currentTarget.checked,
                    })
                  }
                />
                Completed
              </Label>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => onSave(props.activeItem)}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CustomModal;
