import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

// External Components
import { DropdownButton } from "../../../components/dropdownButton";

// Components
import { LineBreak } from "../../basicUIElements";

// Styles
import styles from "./filterBarStyles";

/* Props
* ------------------------------------------------
*   @prop { type }    name                - Description....
*/

const FilterBarView = ({
  rightIconName,
  options,
  defaultText,
  dropdownIconName,
  onDropdownSelect,
  onRightIconPress,
}) => (
  <View style={styles.container}>
    <LineBreak color="#f6f6f6" height={35}>
      <View style={styles.filterBarWrapper}>
        <DropdownButton
          iconName={dropdownIconName}
          options={options}
          defaultText={defaultText}
          onSelect={onDropdownSelect}
        />
        <TouchableOpacity
          onPress={onRightIconPress && onRightIconPress()}
          style={styles.rightIconWrapper}
        >
          <Ionicons style={styles.rightIcon} name={rightIconName} />
        </TouchableOpacity>
      </View>
    </LineBreak>
  </View>
);

export default FilterBarView;