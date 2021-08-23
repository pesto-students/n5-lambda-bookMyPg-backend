README
======

**BookMyPG Application**
========================

**Table of Contents**
---------------------

1.  [About The
    Project](#about-the-project)

2.  [Getting
    Started](#getting-started)

    1.  [Prerequisites](#Prerequisites)

    2.  [Installation](#installation)

3.  [Tech
    Stack](#tech-stack)

4.  [Tools and
    Integration](#tools)

5.  [Resources](#resources)

6.  [Developers](#developers)

7.  [Working & UI
    Screens](#working--ui-screens)

**About The Project**
---------------------

With the need of people who work away from their home and face lots of
difficulties in hunting for accommodation in a new city or location, the
goal of this system is to facilitate them with hassle-free paying guest
services with managing reminders for rent every month and auto payments.
The proposed system will also provide the PG - Owner a huge online
platform to find the Paying Guests effortlessly.

**Live Link**
-------------

BookMyPg App Link:
<http://lambda-n5-bookmypg-fe.s3-website.us-east-2.amazonaws.com/>

**Getting Started**
-------------------

To get a local copy up and running follow these simple steps.

### **Prerequisites**

This is an example of how to list things you need to use the software
and how to install them.

-   npm

> npm install npm@latest -g

### **Installation**

1.  Clone the repos backend & frontend

 >  git clone https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/tree/master

    
 >  git clone  https://github.com/pesto-students/n5-lambda-bookMyPg-backend/tree/master


2.  Install NPM packages in both

    > npm install

3.  Add the .env file in the root for backend app.

 >  PORT=4000

 >  MONGODB\_URL="mongo\_URL"

 >  JWT\_SECRET\_KEY="jwt\_secret\_key"

 >  ADMIN\_EMAIL="admin\_email"

 >  ADMIN\_PASSWORD="admin\_password"

 >  SENDER\_EMAIL="sender\_email"

 > TEST\_CASE\_EMAIL = 'testemail'

 > S3\_DEPLOYMENT\_LINK\_DEV =
    "http://bookmypg-lambda-frontend.s3-website.us-east-2.amazonaws.com"

 > S3\_PUBLIC\_IMAGES\_LINK =
 > "https://bookmypg-public.s3.us-east-2.amazonaws.com/images"

4.  Run the backend server

 > npm run dev

5.  Run the frontend app

 > npm run start

### **Tech Stack**

-   [React.js](https://reactjs.org/)

-   [Redux](https://redux.js.org/)

-   [Node.js](https://nodejs.org/en/)

-   [MongoDB](https://www.mongodb.com/)

### **3rd Party Integration**

-   [Stripe](https://stripe.com/en-in)

-   [AWS S3](https://aws.amazon.com/)

-   [Firebase](https://firebase.google.com/)

### **Tools**

-   [AWS](https://aws.amazon.com/)

-   [Draw.io](https://app.diagrams.net/)

-   [Github](https://github.com/)

### **Source Code Repo**

-   Front End Source Repo -
    <https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/tree/master>

-   Back End Source Repo -
    <https://github.com/pesto-students/n5-lambda-bookMyPg-backend/tree/master>

**Resources**
-------------

-   [User
    Flow](https://bookmypg.atlassian.net/wiki/spaces/BOOKMYPG/pages/327681/BookMyPG+-+Product+Requirement+Document#User-Flows)

-   [PRD](https://bookmypg.atlassian.net/wiki/spaces/BOOKMYPG/pages/327681/BookMyPG+-+Product+Requirement+Document)

-   [High Level
    Design](https://drive.google.com/file/d/1VF9GqN0jKFuclq5QZTl3fMsL_w0-qoBo/view?usp=sharing)
    
    ***Wireframes***
    
    ****Desktop****

-   [Wireframe Desktop](https://balsamiq.cloud/seg1rg9/pgbqrby/r2278?f=N4IgUiBcCMA0IDkoAZ4GEpxAGU%2FAQniALJEBaRA0lANoC6AvkA%3D%3D)

    ****Mobile****

-   [Wireframe Mobile](https://balsamiq.cloud/seg1rg9/pp0tty4/rB1AF?f=N4IgUiBcCMA0IDkpxAYWfAMhkAhHAsjgFo4DSUA2gLoC%2BQA%3D)

**Developers**
--------------

-   Monali Doshi

-   Hari Dhole

-   Vignesh Shenoy

**Out of Scope**
----------------

<https://docs.google.com/document/d/1ovEBByL7V7BoiSYdcjl_cotPAzQ-NG9bKxnZX_6Rae8/edit?usp=sharing>

**Working & UI Screens**
------------------------

Working of the Application:

<https://www.loom.com/share/61c5fa87ef8745b49be755ccbeb99038>

**User Screens**
----------------

### Landing Page

![](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/Home.png)

This is the Landing page of our application. You can navigate to the
below mentioned links from the homepage.

1.  Home ( Landing page)

2.  About us

3.  Login

![](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/Home%202.png)

We have also implemented a dynamic slider to showcase the recently added
properties. This gets update after new properties are added by the owner
via the application.

We have configured role based authentication using firebase and
implemented google sign in.

Anyone who logs in to the application is considered to be an end user.
Owners are added by the administrator manually.

### About us Page

This page lets users know more about our application.

![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/Abou.png)

![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/Abou%202.png)

### Login

Google Login pops up when you click on login.

![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/Login.png)

### Search by Location 

End users can search for properties without having to login to the
application. This simple Location dropdown lets him/her do so.

We have currently added seven major locations. They are

1.  Mumbai

2.  Bengaluru

3.  Ahmedabad

4.  Aurangabad

5.  Chennai

6.  Delhi

7.  Kolkata

![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/Search%20by%20location.png)

### Location wise property list

Location wise property list is fetched on selecting any of the
locations.

![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/Location%20details.png)

The user can directly schedule visit from here or he/she can view more
details about the Property. The details are as follows:

1.  Name of the property.

2.  Address of the property.

3.  Rent of the property.

4.  Amenities provided

5.  Reviews of the property (If any)

More details about the property can be found on clicking ‘**More
details’** button.

![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/More%20details.png)

![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/User%20reviews.png)


### Schedule visit

Users can schedule visit to the properties if he/she would like to check
out the property before moving in. They can do so on clicking
“**Schedule visit**” button.

![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/Schedule%20visit.png)


Basic details are required to schedule a visit. The user may select date
within a Seven day (One week) range.



### Book property

Users can book property on clicking the “**Book Property**” button.

![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/Book%20property.png)

Users may select the preferred date to move in and complete the payment
via stripe payment gateway. This online transaction is completely
trusted and secure.

![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/Stripe.png)


### User Profile

User profile where users can update their details.

![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/User%20profile.png)

### Payment history

User Payment history to keep track of payments.

![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/Payment%20list.png)

### My Properties

User booked properties. He/she can raise complaints or review the property from here.

![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/My%20properties.png)

![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/Review.png)

![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/Raise%20complaint.png)







**Admin Screens**
-----------------

### Owners list
Admin logs in using his/her Gmail account.

Admin is able to Add/Enable/Disable owners from the owners list.

![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/Admin%20owner%20list.png)

![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/Add%20new%20owner.png)

Admin can also search for owner. This search can be further simplified
through the registration date.

### Owner properties
Admin can check for owner properties.

![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/Admin%20owner%20property%20list.png)

### Amenity list

The admin also has access to the Amenity list. He/she can
add/enable/disable amenities.

![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/Amenity%20list.png)

Adding new amenity

![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/Add%20new%20amenity.png)


**Owner Screens**
-----------------

### Property list

Owners are added by admin manually.

Owners have access to the property list. He/she can add/enable/disable a
property. An owner can own more than one property. He/she may list their
properties.


![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/Owner%20property.png)


![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/Add%20new%20property.png)


The owner has to fill in the required form in order to be able to add
the property he/she wishes to list.

Fields to be filled

1.  Name of the property

2.  Address of the property

3.  Beds availability

4.  Description about the property

5.  Location of the property

6.  Amenities from the amenities dropdown that his/her property can
    afford or which are present already.

7.  Gender ( Male/Female/other)

8.  Rent of the property.

9.  Image/Images of the property

Owner may enable or disable the property based on the availability of
the beds.

### Tenants list

The owner has access to the list of tenants. He/she may enable/disable
the tenant.

![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/Tenant%20list.png)

### Complaints list

Owners have access to the complaints list. He/she can click on the
active status of the Complaint to get more details about the complaint.

![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/Complaint%20list.png)

Owners can check the complaint and update the status after being addressed.

![image](https://github.com/pesto-students/n5-lambda-bookmypg-fe-n5-lambda/blob/readme/images/Complaint%20details.png)




