# COSC_4353
Software Design group project

## Description
A partner of your company has requested to build a software application that will predict the rate of the fuel based on the following criteria:
- Client Location (in-state or out-of-state)
- Client history (existing customer with previous purchase or new)
- Gallons requested
- Company profit margin (%)

Software must include following components:
- Login (Allow Client to register if not a client yet)
- Client Registration (Initially only username and Password)
- Client Profile Management (after client registers they should login first to complete profile)
- Fuel Quote Form with Pricing module (Once user enters all required information pricing module calculates the rate provides total cost)
- Fuel Quote History

## Front end
Front end must include following components:
- Login (Allow Client to register if not a client yet)
- Client Registration (Initially only username and Password)
- Client Profile Management (After client registers they should login first to complete the profile). Following fields will be on Profile page / form:
	- Full Name (50 characters, required)
	- Address 1 (100 characters, required)
	- Address 2 (100 characters, optional)
	- City (100 characters, required)
	- State (Drop Down, selection required) DB will store 2 character state code
	- Zipcode (9 characters, at least 5 character code required)
	
- Fuel Quote Form with following fields: (We are not building pricing module yet)
	- Gallons Requested (numeric, required)
	- Delivery Address (Non-editable, comes from client profile)
	- Delivery Date (Calender, date picker)
	- Suggested Price / gallon (numeric non-editable, price will be calculated by Pricing Module - we are not building pricing module yet)
	- Total Amount Due (numeric non-editable, calculated (gallons * price))
	
- Fuel Quote History
	- Tabular display of all client quotes in the past. All fields from Fuel Quote are displayed.

- You should have validations in place for required fields, field types, and field lengths.