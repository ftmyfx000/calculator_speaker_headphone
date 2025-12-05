# Requirements Document

## Introduction

This document specifies the requirements for a speaker box volume calculator feature. The calculator will compute box dimensions, volume, dimensional ratios, and standing wave frequencies for speaker enclosures. Users can input either internal or external dimensions, and the system will calculate all related acoustic properties including room mode frequencies.

## Glossary

- **System**: The box volume calculator web application
- **Internal Dimensions**: The interior measurements of the box (width, height, depth) in centimeters
- **External Dimensions**: The exterior measurements of the box (width, height, depth) in centimeters
- **Panel Thickness**: The thickness of the box wall material in centimeters
- **Volume**: The internal air volume of the box in cubic centimeters or liters
- **Standing Wave**: Acoustic resonances that occur at specific frequencies within an enclosed space
- **Mode Order**: The harmonic number (n, m, l) representing the standing wave pattern
- **Composite Mode**: Standing wave patterns that occur along multiple axes simultaneously
- **Sound Speed**: The speed of sound in air, approximately 343 m/s at 20°C
- **Dimensional Ratio**: The proportional relationship between width, height, and depth

## Requirements

### Requirement 1

**User Story:** As a speaker builder, I want to input internal box dimensions and panel thickness, so that I can calculate external dimensions and acoustic properties.

#### Acceptance Criteria

1. WHEN a user enters internal width, internal height, internal depth, and panel thickness THEN the System SHALL calculate external width as internal width plus two times panel thickness
2. WHEN a user enters internal width, internal height, internal depth, and panel thickness THEN the System SHALL calculate external height as internal height plus two times panel thickness
3. WHEN a user enters internal width, internal height, internal depth, and panel thickness THEN the System SHALL calculate external depth as internal depth plus two times panel thickness
4. WHEN a user enters internal dimensions THEN the System SHALL calculate internal volume as the product of internal width, internal height, and internal depth
5. WHEN internal volume is calculated THEN the System SHALL convert the volume to liters by dividing cubic centimeters by 1000

### Requirement 2

**User Story:** As a speaker builder, I want to input external box dimensions and panel thickness, so that I can determine the usable internal volume.

#### Acceptance Criteria

1. WHEN a user enters external width, external height, external depth, and panel thickness THEN the System SHALL calculate internal width as external width minus two times panel thickness
2. WHEN a user enters external width, external height, external depth, and panel thickness THEN the System SHALL calculate internal height as external height minus two times panel thickness
3. WHEN a user enters external width, external height, external depth, and panel thickness THEN the System SHALL calculate internal depth as external depth minus two times panel thickness
4. WHEN external dimensions are provided and panel thickness exceeds half of any external dimension THEN the System SHALL prevent calculation and display an error message
5. WHEN internal dimensions are calculated from external dimensions THEN the System SHALL calculate internal volume as the product of internal width, internal height, and internal depth

### Requirement 3

**User Story:** As a speaker builder, I want to see dimensional ratios, so that I can evaluate box proportions for optimal acoustic performance.

#### Acceptance Criteria

1. WHEN internal dimensions are available THEN the System SHALL calculate internal dimensional ratio as width to height to depth
2. WHEN external dimensions are available THEN the System SHALL calculate external dimensional ratio as width to height to depth
3. WHEN displaying dimensional ratios THEN the System SHALL normalize the ratios to show proportional relationships

### Requirement 4

**User Story:** As a speaker builder, I want to calculate standing wave frequencies for each axis, so that I can identify potential acoustic resonances.

#### Acceptance Criteria

1. WHEN internal dimensions are available THEN the System SHALL calculate first order standing wave frequency for width axis as sound speed divided by two times internal width in meters
2. WHEN internal dimensions are available THEN the System SHALL calculate second order standing wave frequency for width axis as sound speed divided by internal width in meters
3. WHEN internal dimensions are available THEN the System SHALL calculate third order standing wave frequency for width axis as 1.5 times sound speed divided by internal width in meters
4. WHEN internal dimensions are available THEN the System SHALL calculate first, second, and third order standing wave frequencies for height axis using the same pattern as width axis
5. WHEN internal dimensions are available THEN the System SHALL calculate first, second, and third order standing wave frequencies for depth axis using the same pattern as width axis
6. WHEN calculating standing wave frequencies THEN the System SHALL use sound speed value of 343 meters per second

### Requirement 5

**User Story:** As a speaker builder, I want to calculate composite mode frequencies, so that I can identify complex standing wave patterns.

#### Acceptance Criteria

1. WHEN internal dimensions are available THEN the System SHALL calculate composite mode frequency using the formula: frequency equals sound speed divided by two, multiplied by the square root of the sum of squared terms for each axis
2. WHEN calculating composite mode frequency THEN the System SHALL compute each axis term as mode order divided by internal dimension in meters, then squared
3. WHEN displaying composite mode frequencies THEN the System SHALL calculate frequencies for mode combinations including (1,0,0), (0,1,0), (0,0,1), (1,1,0), (1,0,1), (0,1,1), (1,1,1), (2,0,0), (0,2,0), (0,0,2), (2,1,0), (2,0,1), (0,2,1), (1,2,0), (1,0,2), (0,1,2), (2,2,0), (2,0,2), (0,2,2), (2,1,1), (1,2,1), (1,1,2), (2,2,1), (2,1,2), (1,2,2), (2,2,2), (3,0,0), (0,3,0), and (0,0,3)
4. WHEN displaying frequencies THEN the System SHALL format frequency values to one decimal place

### Requirement 6

**User Story:** As a speaker builder, I want to switch between internal and external dimension input modes, so that I can work with the measurements I have available.

#### Acceptance Criteria

1. WHEN the System starts THEN the System SHALL provide a calculation mode selector with internal dimension mode and external dimension mode options
2. WHEN a user selects internal dimension mode THEN the System SHALL display input fields for internal width, internal height, internal depth, and panel thickness
3. WHEN a user selects external dimension mode THEN the System SHALL display input fields for external width, external height, external depth, and panel thickness
4. WHEN calculation mode is changed THEN the System SHALL preserve panel thickness value across modes
5. WHEN calculation mode is changed THEN the System SHALL clear dimension input values

### Requirement 7

**User Story:** As a speaker builder, I want input validation, so that I receive accurate calculations and clear error messages.

#### Acceptance Criteria

1. WHEN a user enters dimension values THEN the System SHALL validate that all dimensions are positive numbers
2. WHEN a user enters panel thickness in external dimension mode THEN the System SHALL validate that panel thickness is less than half of each external dimension
3. WHEN invalid input is detected THEN the System SHALL display a descriptive error message indicating the validation issue
4. WHEN all inputs are valid THEN the System SHALL perform calculations and display results
5. WHEN dimension inputs are empty THEN the System SHALL not display error messages until user attempts calculation

### Requirement 8

**User Story:** As a speaker builder, I want clear display of all calculation results, so that I can easily read and use the acoustic data.

#### Acceptance Criteria

1. WHEN calculations are complete THEN the System SHALL display internal volume in both cubic centimeters and liters
2. WHEN calculations are complete THEN the System SHALL display all three dimensions with appropriate labels for width, height, and depth
3. WHEN calculations are complete THEN the System SHALL display dimensional ratios for both internal and external dimensions
4. WHEN calculations are complete THEN the System SHALL display basic mode frequencies for all three axes
5. WHEN calculations are complete THEN the System SHALL display a comprehensive table of composite mode frequencies with mode order labels
6. WHEN displaying frequency values THEN the System SHALL format all frequencies to one decimal place in Hertz
