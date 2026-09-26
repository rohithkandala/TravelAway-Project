/* =========================================================
   TRAVELAWAY DATABASE
   COMPLETE CORRECTED SQL SERVER SCRIPT
   ========================================================= */

USE master;
GO

/* =========================================================
   DROP DATABASE IF IT EXISTS
   ========================================================= */

IF DB_ID('TravelAwayDB') IS NOT NULL
BEGIN
    ALTER DATABASE TravelAwayDB
    SET SINGLE_USER
    WITH ROLLBACK IMMEDIATE;

    DROP DATABASE TravelAwayDB;
END
GO

/* =========================================================
   CREATE DATABASE
   ========================================================= */

CREATE DATABASE TravelAwayDB;
GO

USE TravelAwayDB;
GO


/* =========================================================
   ROLES
   ========================================================= */

CREATE TABLE Roles
(
    RoleId TINYINT
        CONSTRAINT pk_RoleId
        PRIMARY KEY IDENTITY(1,1),

    RoleName VARCHAR(20)
        CONSTRAINT uq_RoleName
        UNIQUE
        NOT NULL
);
GO

SET IDENTITY_INSERT Roles ON;

INSERT INTO Roles
(
    RoleId,
    RoleName
)
VALUES
(1,'Customer'),
(2,'Employee');

SET IDENTITY_INSERT Roles OFF;
GO


/* =========================================================
   CUSTOMER
   ========================================================= */

CREATE TABLE Customer
(
    EmailId VARCHAR(50)
        CONSTRAINT pk_EmailId
        PRIMARY KEY,

    RoleId TINYINT
        CONSTRAINT fk_RoleId
        REFERENCES Roles(RoleId),

    FirstName VARCHAR(50)
        CONSTRAINT chk_FirstName
        CHECK(FirstName NOT LIKE '% %')
        NOT NULL,

    LastName VARCHAR(50)
        CONSTRAINT chk_LastName
        CHECK(LastName NOT LIKE '% %')
        NOT NULL,

    UserPassword VARCHAR(15)
        CONSTRAINT chk_UserPassword
        CHECK
        (
            LEN(UserPassword) >= 8
            AND LEN(UserPassword) <= 15
        )
        NOT NULL,

    Gender CHAR
        CONSTRAINT chk_Gender
        CHECK(Gender IN ('F','M'))
        NOT NULL,

    ContactNumber NUMERIC(10)
        CONSTRAINT chk_ContactNumber
        CHECK
        (
            ContactNumber NOT LIKE '0%'
            AND LEN(ContactNumber) = 10
        )
        NOT NULL,

    DateOfBirth DATE
        CONSTRAINT chk_DateOfBirth
        CHECK(DateOfBirth < GETDATE())
        NOT NULL,

    [Address] VARCHAR(250) NOT NULL
);
GO


INSERT INTO Customer
(
    EmailId,
    UserPassword,
    RoleId,
    Gender,
    FirstName,
    LastName,
    ContactNumber,
    DateOfBirth,
    [Address]
)
VALUES
('poorvi@gmail.com','abcd@1234',1,'M','Poorvi','Jain',8465713549,'1998-12-04','Lucknow'),

('Mayank@gmail.com','efgh@1234',1,'M','Mayank','Sharma',2457984315,'1999-05-22','Delhi'),

('Prabhjeet@gmail.com','hijk@1234',1,'F','Prabhjeet','Bhabar',4587921568,'1997-10-26','Mumbai'),

('Sagar@gmail.com','lmno@1234',1,'M','Sagar','Sharma',3654789125,'1998-08-17','Pune'),

('rahul@gmail.com','rahul@1234',1,'M','Rahul','Kumar',9876543211,'1996-06-15','Hyderabad'),

('sneha@gmail.com','sneha@1234',1,'F','Sneha','Reddy',9876543212,'1997-09-20','Bangalore');
GO


/* =========================================================
   PACKAGE CATEGORY
   ========================================================= */

CREATE TABLE PackageCategory
(
    PackageCategoryId INT
        CONSTRAINT pk_PackageCategoryId
        PRIMARY KEY IDENTITY(100,1),

    PackageCategoryName VARCHAR(20)
        CONSTRAINT uq_PackageCategoryName
        UNIQUE
        NOT NULL
);
GO


INSERT INTO PackageCategory
(
    PackageCategoryName
)
VALUES
('Adventure'),
('Nature'),
('Religious'),
('Village'),
('Wildlife');
GO


/* =========================================================
   PACKAGE
   ========================================================= */

CREATE TABLE Package
(
    PackageId INT
        CONSTRAINT pk_PackageId
        PRIMARY KEY IDENTITY(2000,1),

    PackageName VARCHAR(30)
        CONSTRAINT uq_PackageName
        UNIQUE
        NOT NULL,

    PackageCategoryId INT
        CONSTRAINT fk_PackageCategoryId
        REFERENCES PackageCategory(PackageCategoryId),

    TypeOfPackage VARCHAR(15)
        CONSTRAINT chk_TypeOfPackage
        CHECK
        (
            TypeOfPackage IN
            (
                'International',
                'Domestic'
            )
        )
);
GO


INSERT INTO Package
(
    PackageName,
    PackageCategoryId,
    TypeOfPackage
)
VALUES
('North India',100,'Domestic'),
('Malibu Islands',101,'International'),
('America',102,'International'),
('Australia',103,'International'),
('Maldives',104,'International'),
('Kasol-Manali',100,'Domestic'),
('Beauty of South',101,'Domestic'),
('Himachal',102,'Domestic'),
('Heart of India',100,'Domestic');
GO


/* =========================================================
   PACKAGE DETAILS
   IMPORTANT:
   PackageDetailsId will be:
   900,901,902,903,904,905,906,907,908
   ========================================================= */

CREATE TABLE PackageDetails
(
    PackageDetailsId INT
        CONSTRAINT pk_PackageDetailsId
        PRIMARY KEY IDENTITY(900,1),

    PackageId INT
        CONSTRAINT fk_PackageId
        REFERENCES Package(PackageId),

    PlacesToVisit VARCHAR(500) NOT NULL,

    [Description] VARCHAR(500) NOT NULL,

    NoOfDays INT NOT NULL,

    NoOfNights INT NOT NULL,

    Accomodation VARCHAR(10)
        CONSTRAINT chk_Accomodation
        CHECK
        (
            Accomodation IN
            (
                'Available',
                'Unavailable'
            )
        ),

    PricePerAdult DECIMAL(12,2)
);
GO


INSERT INTO PackageDetails
(
    PackageId,
    PlacesToVisit,
    [Description],
    NoOfDays,
    NoOfNights,
    Accomodation,
    PricePerAdult
)
VALUES
(2000,'Ooty','Great Place!',2,2,'Available',1000),

(2001,'Jaipur','Great Place!',3,2,'Available',1200),

(2002,'America','America never sleeps',5,4,'Available',9500),

(2003,'Australia','Explore the beauty',4,4,'Available',8500),

(2004,'Maldives','Love beaches? Check this out!!',4,3,'Available',9000),

(2005,'Kullu-Manali','Best for trips with friends!',4,3,'Available',900),

(2006,'Kanyakumari-Kerala','Heritage of India',4,4,'Available',1500),

(2007,'Dehradun-Rishikesh','Religious-Family Place!',3,2,'Available',800),

(2008,'Delhi','Great Place!',2,2,'Available',2000);
GO


/* =========================================================
   VERIFY PACKAGE DETAILS IDS
   ========================================================= */

SELECT
    PackageDetailsId,
    PackageId,
    PlacesToVisit,
    PricePerAdult
FROM PackageDetails;
GO


/* =========================================================
   HOTEL
   ========================================================= */

CREATE TABLE Hotel
(
    HotelId INT
        CONSTRAINT pk_HotelId
        PRIMARY KEY IDENTITY(1000,1),

    HotelName VARCHAR(20) NOT NULL,

    HotelRating INT NOT NULL
        CONSTRAINT chk_HotelRating
        CHECK
        (
            HotelRating >= 2
            AND HotelRating <= 5
        ),

    SingleRoomPrice MONEY,

    DoubleRoomPrice MONEY,

    DeluxeeRoomPrice MONEY,

    SuiteRoomPrice MONEY,

    City VARCHAR(20)
);
GO


INSERT INTO Hotel
(
    HotelName,
    HotelRating,
    SingleRoomPrice,
    DoubleRoomPrice,
    DeluxeeRoomPrice,
    SuiteRoomPrice,
    City
)
VALUES
('Swosti Grand',4,700,1400,2100,3500,'Ooty'),

('Grand Hayat',3,1400,2900,4800,6500,'Jaipur'),

('Waterfront',3,2800,4000,8800,12000,'America'),

('Hotel Park View',4,3200,5500,7800,10000,'Australia'),

('Taj',5,5000,8000,12000,18000,'Pune'),

('Ashok',4,2500,4000,6500,9000,'Pune'),

('Lake View',4,1800,3000,5000,7500,'Delhi'),

('Mountain Resort',5,3000,5000,8000,12000,'Manali');
GO


/* =========================================================
   BOOK PACKAGE
   ========================================================= */

CREATE TABLE BookPackage
(
    EmailId VARCHAR(50)
        CONSTRAINT fk_EmailId
        REFERENCES Customer(EmailId),

    BookingId INT
        CONSTRAINT pk_BookingId
        PRIMARY KEY IDENTITY(4000,1),

    ContactNumber NUMERIC(10) NOT NULL,

    [Address] VARCHAR(100) NOT NULL,

    DateOfTravel DATE NOT NULL
        CONSTRAINT chk_DateOfTravel
        CHECK(DateOfTravel >= GETDATE()),

    NumberOfAdults INT NOT NULL
        CONSTRAINT chk_NumberOfAdults
        CHECK(NumberOfAdults > 0),

    NumberOfChildren INT
        CONSTRAINT chk_NumberOfChildren
        CHECK(NumberOfChildren >= 0),

    [Status] VARCHAR(10) NOT NULL
        CONSTRAINT chk_Status
        CHECK
        (
            [Status] IN
            (
                'Booked',
                'Confirmed'
            )
        ),

    /*
       IMPORTANT:
       This references PackageDetailsId,
       NOT Package.PackageId.
    */
    PackageId INT
        CONSTRAINT fk_packId
        REFERENCES PackageDetails(PackageDetailsId)
);
GO


/* =========================================================
   BOOKING DATA
   =========================================================
   
   VALID PackageDetailsId values:
   900 - North India
   901 - Malibu Islands
   902 - America
   903 - Australia
   904 - Maldives
   905 - Kasol-Manali
   906 - Beauty of South
   907 - Himachal
   908 - Heart of India

   DO NOT USE 909
   ========================================================= */

INSERT INTO BookPackage
(
    EmailId,
    ContactNumber,
    [Address],
    DateOfTravel,
    NumberOfAdults,
    NumberOfChildren,
    [Status],
    PackageId
)
VALUES
(
    'Mayank@gmail.com',
    2457984315,
    '310-Lucknow',
    '2026-12-20',
    2,
    0,
    'Booked',
    900
),

(
    'poorvi@gmail.com',
    8465713549,
    '253-Delhi',
    '2027-01-15',
    3,
    0,
    'Booked',
    908
),

(
    'Prabhjeet@gmail.com',
    4587921568,
    '310-Agra',
    '2027-02-10',
    2,
    1,
    'Confirmed',
    901
),

(
    'Sagar@gmail.com',
    3654789125,
    '310-Pune',
    '2027-03-15',
    2,
    0,
    'Booked',
    902
),

(
    'rahul@gmail.com',
    9876543211,
    'Hyderabad',
    '2027-04-10',
    4,
    2,
    'Confirmed',
    903
),

(
    'sneha@gmail.com',
    9876543212,
    'Bangalore',
    '2027-05-20',
    2,
    1,
    'Booked',
    904
);
GO


/* =========================================================
   VERIFY BOOKING IDS
   ========================================================= */

SELECT
    BookingId,
    EmailId,
    PackageId,
    DateOfTravel,
    [Status]
FROM BookPackage;
GO


/* =========================================================
   ACCOMMODATION
   ========================================================= */

CREATE TABLE Accomodation
(
    AccomodationId INT
        CONSTRAINT pk_AccomodationId
        PRIMARY KEY IDENTITY(1,1),

    BookingId INT
        CONSTRAINT fk_BookingId
        REFERENCES BookPackage(BookingId),

    HotelName VARCHAR(20),

    City VARCHAR(30),

    NoOfRooms INT NOT NULL
        CONSTRAINT chk_NoOfRooms
        CHECK(NoOfRooms > 0),

    HotelRating INT
        CONSTRAINT chk_HotelR
        CHECK
        (
            HotelRating >= 1
            AND HotelRating <= 5
        ),

    Price MONEY,

    RoomType VARCHAR(20)
        CONSTRAINT chk_RoomType
        CHECK
        (
            RoomType IN
            (
                'Single',
                'Double',
                'Deluxe',
                'Suite'
            )
        )
        NOT NULL
);
GO


/* =========================================================
   ACCOMMODATION DATA
   BookingIds now definitely exist:
   4000,4001,4002,4003,4004,4005
   ========================================================= */

INSERT INTO Accomodation
(
    BookingId,
    HotelName,
    City,
    NoOfRooms,
    HotelRating,
    Price,
    RoomType
)
VALUES
(4000,'Ashok','Pune',2,4,10000,'Deluxe'),

(4001,'Lake View','Delhi',1,4,7500,'Suite'),

(4002,'Grand Hayat','Jaipur',2,3,12000,'Double'),

(4003,'Waterfront','America',2,3,20000,'Suite'),

(4004,'Hotel Park View','Australia',2,4,16000,'Double'),

(4005,'Swosti Grand','Ooty',1,4,7000,'Single');
GO


/* =========================================================
   RATING
   ========================================================= */

CREATE TABLE Rating
(
    RatingId INT
        CONSTRAINT pk_RatingId
        PRIMARY KEY IDENTITY(1,1),

    [Comments] VARCHAR(200),

    Rating INT
        CONSTRAINT chk_Rating
        CHECK
        (
            Rating > 0
            AND Rating <= 5
        ),

    BookingId INT
        CONSTRAINT fk_BookId
        REFERENCES BookPackage(BookingId)
);
GO


/* =========================================================
   RATING DATA
   ========================================================= */

INSERT INTO Rating
(
    [Comments],
    Rating,
    BookingId
)
VALUES
('Excellent experience',5,4000),

('Good trip',4,4001),

('Very good service',4,4002),

('Average experience',3,4003),

('Excellent arrangements',5,4004),

('Good overall experience',4,4005);
GO


/* =========================================================
   VEHICLE
   ========================================================= */

CREATE TABLE Vehicle
(
    VehicleId INT
        CONSTRAINT pk_VehicleId
        PRIMARY KEY IDENTITY(5000,1),

    VehicleName VARCHAR(20) NOT NULL,

    VehicleType VARCHAR(20)
        CONSTRAINT chk_Vehicle
        CHECK
        (
            VehicleType IN
            (
                'Two-Wheeler',
                'Four-Wheeler',
                'Mini-Bus'
            )
        ),

    RatePerHour DECIMAL(20,2) NOT NULL,

    RatePerKm DECIMAL(20,2) NOT NULL,

    BasePrice DECIMAL(20,2) NOT NULL
);
GO


INSERT INTO Vehicle
(
    VehicleName,
    VehicleType,
    RatePerHour,
    RatePerKm,
    BasePrice
)
VALUES
('City','Four-Wheeler',7,9,200),

('Honda-City','Four-Wheeler',15,20,1000),

('Shine','Two-Wheeler',7,9,350),

('Etios Cross','Four-Wheeler',20,9,500),

('Alto 800','Four-Wheeler',15,9,450),

('Suzuki-1200','Mini-Bus',20,15,800);
GO


/* =========================================================
   VEHICLE BOOKING
   ========================================================= */

CREATE TABLE VehicleBooked
(
    VehicleBookingId INT
        CONSTRAINT pk_VehicleBookingId
        PRIMARY KEY IDENTITY(1,1),

    VehicleId INT
        CONSTRAINT fk_VehicleId
        REFERENCES Vehicle(VehicleId),

    VehicleName VARCHAR(20) NOT NULL,

    BookingDate DATE
        CONSTRAINT chk_BookingDate
        CHECK(BookingDate >= GETDATE())
        NOT NULL,

    PickupTime VARCHAR(20) NOT NULL,

    NoOfHours INT
        CONSTRAINT chk_NoOfHours
        CHECK(NoOfHours >= 3)
        NOT NULL,

    NoOfKms INT NOT NULL,

    TotalCost DECIMAL(20,2) NOT NULL,

    VehicleStatus VARCHAR(30)
        CONSTRAINT chk_VehicleStatus
        CHECK
        (
            VehicleStatus IN
            (
                'Booked',
                'Active',
                'Closed'
            )
        )
);
GO


INSERT INTO VehicleBooked
(
    VehicleId,
    VehicleName,
    BookingDate,
    PickupTime,
    NoOfHours,
    NoOfKms,
    TotalCost,
    VehicleStatus
)
VALUES
(5000,'City','2026-10-15','10:00 AM',4,50,750,'Booked'),

(5001,'Honda-City','2026-11-20','09:00 AM',6,100,3500,'Active'),

(5002,'Shine','2026-12-05','08:00 AM',3,40,800,'Closed'),

(5003,'Etios Cross','2027-01-10','11:00 AM',5,80,2000,'Booked');
GO


/* =========================================================
   EMPLOYEE
   ========================================================= */

CREATE TABLE Employee
(
    EmpId INT
        CONSTRAINT pk_EMPID
        PRIMARY KEY IDENTITY,

    FirstName VARCHAR(50)
        CONSTRAINT chk_FName
        CHECK(FirstName NOT LIKE '% %')
        NOT NULL,

    LastName VARCHAR(50)
        CONSTRAINT chk_LName
        CHECK(LastName NOT LIKE '% %')
        NOT NULL,

    [Password] VARCHAR(15)
        CONSTRAINT chk_Password
        CHECK
        (
            LEN([Password]) >= 8
            AND LEN([Password]) <= 15
        )
        NOT NULL,

    RoleId TINYINT
        CONSTRAINT fk_RId
        REFERENCES Roles(RoleId),

    EmailId VARCHAR(50)
);
GO


INSERT INTO Employee
(
    FirstName,
    LastName,
    [Password],
    RoleId,
    EmailId
)
VALUES
('Steve','Rogers','qwertyuiop',2,'steve@gmail.com'),

('Peter','Parker','asdfghjkl',2,'peter@gmail.com'),

('Tony','Stark','tony@1234',2,'tony@gmail.com');
GO


/* =========================================================
   CUSTOMER CARE
   ========================================================= */

CREATE TABLE CustomerCare
(
    QueryId INT
        CONSTRAINT pk_QueryId
        PRIMARY KEY IDENTITY,

    BookingId INT
        CONSTRAINT fk_BId
        REFERENCES BookPackage(BookingId),

    [Query] VARCHAR(100),

    QueryStatus VARCHAR(30)
        CONSTRAINT chk_QueryStatus
        CHECK
        (
            QueryStatus IN
            (
                'Assigned',
                'In Progress',
                'Closed'
            )
        ),

    Assignee INT
        CONSTRAINT fk_Assignee
        REFERENCES Employee(EmpId),

    QueryAnswer VARCHAR(200)
);
GO


INSERT INTO CustomerCare
(
    BookingId,
    [Query],
    QueryStatus,
    Assignee,
    QueryAnswer
)
VALUES
(4000,'Need airport pickup','Assigned',1,NULL),

(4001,'Need room upgrade','In Progress',2,NULL),

(4002,'Need itinerary details','Closed',1,'Itinerary has been shared'),

(4003,'Need vehicle assistance','Assigned',3,NULL),

(4004,'Need special meal','In Progress',1,NULL),

(4005,'Need early check-in','Assigned',2,NULL);
GO


/* =========================================================
   PAYMENT
   ========================================================= */

CREATE TABLE Payment
(
    PaymentId INT
        CONSTRAINT pk_PaymentId
        PRIMARY KEY IDENTITY,

    BookingId INT
        CONSTRAINT fk_PaymentBookId
        REFERENCES BookPackage(BookingId),

    TotalAmount MONEY,

    PaymentStatus VARCHAR(20)
        CONSTRAINT chk_PaymentStatus
        CHECK
        (
            PaymentStatus IN
            (
                'Confirmed',
                'Not Confirmed'
            )
        )
);
GO


INSERT INTO Payment
(
    BookingId,
    TotalAmount,
    PaymentStatus
)
VALUES
(4000,20000,'Confirmed'),

(4001,25000,'Confirmed'),

(4002,35000,'Confirmed'),

(4003,45000,'Not Confirmed'),

(4004,50000,'Confirmed'),

(4005,30000,'Not Confirmed');
GO


/* =========================================================
   PROCEDURE - REGISTER CUSTOMER
   ========================================================= */

CREATE OR ALTER PROCEDURE usp_RegisterCustomer
(
    @EmailId VARCHAR(30),
    @FirstName VARCHAR(20),
    @LastName VARCHAR(20),
    @Password VARCHAR(16),
    @Gender CHAR,
    @Contact NUMERIC(10),
    @DOB DATE,
    @Address VARCHAR(50)
)
AS
BEGIN

    SET NOCOUNT ON;

    DECLARE @RoleId TINYINT;
    DECLARE @retval INT;

    BEGIN TRY

        IF @EmailId IS NULL OR LEN(@EmailId) < 4
            SET @retval = -1;

        ELSE IF EXISTS
        (
            SELECT 1
            FROM Customer
            WHERE EmailId = @EmailId
        )
            SET @retval = -6;

        ELSE IF @Password IS NULL
             OR LEN(@Password) < 8
             OR LEN(@Password) > 15
            SET @retval = -2;

        ELSE IF @DOB IS NULL
             OR @DOB >= CAST(GETDATE() AS DATE)
            SET @retval = -3;

        ELSE IF DATEDIFF(YEAR,@DOB,GETDATE()) < 18
            SET @retval = -4;

        ELSE IF @FirstName IS NULL
             OR @FirstName = ''
             OR @FirstName LIKE '%[^a-zA-Z]%'
            SET @retval = -5;

        ELSE IF @LastName IS NULL
             OR @LastName = ''
             OR @LastName LIKE '%[^a-zA-Z]%'
            SET @retval = -5;

        ELSE IF @Gender NOT IN ('M','F')
            SET @retval = -7;

        ELSE IF @Contact IS NULL
             OR LEN(@Contact) <> 10
             OR @Contact LIKE '0%'
            SET @retval = -8;

        ELSE
        BEGIN

            SELECT @RoleId = RoleId
            FROM Roles
            WHERE RoleName = 'Customer';

            INSERT INTO Customer
            (
                EmailId,
                RoleId,
                FirstName,
                LastName,
                UserPassword,
                Gender,
                ContactNumber,
                DateOfBirth,
                [Address]
            )
            VALUES
            (
                @EmailId,
                @RoleId,
                @FirstName,
                @LastName,
                @Password,
                @Gender,
                @Contact,
                @DOB,
                @Address
            );

            SET @retval = 1;

        END

        SELECT @retval AS ReturnValue;

    END TRY

    BEGIN CATCH

        SELECT
            -99 AS ReturnValue,
            ERROR_LINE() AS ErrorLine,
            ERROR_MESSAGE() AS ErrorMessage;

    END CATCH

END;
GO


/* =========================================================
   PROCEDURE - LOGIN
   ========================================================= */

CREATE OR ALTER PROCEDURE usp_Login
(
    @EmailId VARCHAR(30),
    @Password VARCHAR(16)
)
AS
BEGIN

    SET NOCOUNT ON;

    BEGIN TRY

        IF NOT EXISTS
        (
            SELECT 1
            FROM Customer
            WHERE EmailId = @EmailId
        )
            RETURN -1;

        ELSE IF NOT EXISTS
        (
            SELECT 1
            FROM Customer
            WHERE EmailId = @EmailId
            AND UserPassword = @Password
        )
            RETURN 0;

        ELSE
            RETURN 1;

    END TRY

    BEGIN CATCH

        RETURN -99;

    END CATCH

END;
GO


/* =========================================================
   PROCEDURE - EMPLOYEE LOGIN
   ========================================================= */

CREATE OR ALTER PROCEDURE usp_LoginEmployee
(
    @EmailId VARCHAR(30),
    @Password VARCHAR(16)
)
AS
BEGIN

    SET NOCOUNT ON;

    BEGIN TRY

        IF NOT EXISTS
        (
            SELECT 1
            FROM Employee
            WHERE EmailId = @EmailId
        )
            RETURN -1;

        ELSE IF NOT EXISTS
        (
            SELECT 1
            FROM Employee
            WHERE EmailId = @EmailId
            AND [Password] = @Password
        )
            RETURN 0;

        ELSE
            RETURN 1;

    END TRY

    BEGIN CATCH

        RETURN -99;

    END CATCH

END;
GO


/* =========================================================
   PROCEDURE - EDIT PROFILE
   ========================================================= */

CREATE OR ALTER PROCEDURE usp_EditProfile
(
    @EmailId VARCHAR(50),
    @FirstName VARCHAR(30),
    @LastName VARCHAR(30),
    @Gender CHAR,
    @ContactNumber NUMERIC(10),
    @DateOfBirth DATE,
    @Address VARCHAR(200)
)
AS
BEGIN

    SET NOCOUNT ON;

    DECLARE @retval INT;

    BEGIN TRY

        IF @EmailId IS NULL
            SET @retval = -1;

        ELSE IF NOT EXISTS
        (
            SELECT 1
            FROM Customer
            WHERE EmailId = @EmailId
        )
            SET @retval = -8;

        ELSE IF @FirstName IS NULL
             OR @FirstName = ''
             OR @FirstName LIKE '%[^a-zA-Z]%'
            SET @retval = -2;

        ELSE IF @LastName IS NULL
             OR @LastName = ''
             OR @LastName LIKE '%[^a-zA-Z]%'
            SET @retval = -3;

        ELSE IF @Gender NOT IN ('M','F')
            SET @retval = -4;

        ELSE IF @ContactNumber IS NULL
             OR LEN(@ContactNumber) <> 10
             OR @ContactNumber LIKE '0%'
            SET @retval = -5;

        ELSE IF @DateOfBirth IS NULL
             OR @DateOfBirth >= CAST(GETDATE() AS DATE)
            SET @retval = -6;

        ELSE IF @Address IS NULL
            SET @retval = -7;

        ELSE
        BEGIN

            UPDATE Customer
            SET
                FirstName = @FirstName,
                LastName = @LastName,
                Gender = @Gender,
                ContactNumber = @ContactNumber,
                DateOfBirth = @DateOfBirth,
                [Address] = @Address
            WHERE EmailId = @EmailId;

            SET @retval = 1;

        END

        RETURN @retval;

    END TRY

    BEGIN CATCH

        RETURN -99;

    END CATCH

END;
GO


/* =========================================================
   FUNCTION - VIEW PACKAGE CATEGORY
   ========================================================= */

CREATE OR ALTER FUNCTION ufn_ViewPackageCategory()
RETURNS TABLE
AS
RETURN
(
    SELECT
        PackageCategoryId,
        PackageCategoryName
    FROM PackageCategory
);
GO


/* =========================================================
   FUNCTION - VIEW ALL PACKAGES
   ========================================================= */

CREATE OR ALTER FUNCTION ufn_ViewAllPackages()
RETURNS TABLE
AS
RETURN
(
    SELECT
        P.PackageId,
        P.PackageName,
        PC.PackageCategoryName,
        P.PackageCategoryId,
        P.TypeOfPackage
    FROM Package P
    INNER JOIN PackageCategory PC
        ON P.PackageCategoryId = PC.PackageCategoryId
);
GO


/* =========================================================
   FUNCTION - VIEW PACKAGES BY CATEGORY
   ========================================================= */

CREATE OR ALTER FUNCTION ufn_ViewPackagesByCategory
(
    @PackageCategoryId INT
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        P.PackageId,
        P.PackageName,
        P.PackageCategoryId,
        P.TypeOfPackage
    FROM Package P
    WHERE P.PackageCategoryId = @PackageCategoryId
);
GO


/* =========================================================
   FUNCTION - VIEW PACKAGE DETAILS
   ========================================================= */

CREATE OR ALTER FUNCTION ufn_ViewPackageDetail
(
    @PackageId INT
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        P.PackageName,
        PD.PlacesToVisit,
        PD.[Description],
        PD.NoOfDays,
        PD.NoOfNights,
        PD.Accomodation,
        PD.PricePerAdult
    FROM Package P
    INNER JOIN PackageDetails PD
        ON P.PackageId = PD.PackageId
    WHERE P.PackageId = @PackageId
);
GO


/* =========================================================
   PROCEDURE - BOOK PACKAGE
   ========================================================= */

CREATE OR ALTER PROCEDURE usp_BookPackage
(
    @EmailId VARCHAR(50),
    @ContactNumber NUMERIC(10),
    @Address VARCHAR(100),
    @DateOfTravel DATE,
    @NumberOfAdults INT,
    @NumberOfChildren INT,
    @Status VARCHAR(10),
    @PackageId INT,
    @BookingId INT OUT
)
AS
BEGIN

    SET NOCOUNT ON;

    BEGIN TRY

        IF NOT EXISTS
        (
            SELECT 1
            FROM Customer
            WHERE EmailId = @EmailId
        )
            RETURN -1;

        IF @ContactNumber IS NULL
            RETURN -2;

        IF @DateOfTravel IS NULL
           OR @DateOfTravel <= CAST(GETDATE() AS DATE)
            RETURN -3;

        IF ISNULL(@NumberOfAdults,0) <= 0
           AND ISNULL(@NumberOfChildren,0) <= 0
            RETURN -4;

        IF @PackageId IS NULL
           OR NOT EXISTS
           (
               SELECT 1
               FROM PackageDetails
               WHERE PackageDetailsId = @PackageId
           )
            RETURN -5;

        IF @Status NOT IN ('Booked','Confirmed')
            RETURN -6;

        INSERT INTO BookPackage
        (
            EmailId,
            ContactNumber,
            [Address],
            DateOfTravel,
            NumberOfAdults,
            NumberOfChildren,
            [Status],
            PackageId
        )
        VALUES
        (
            @EmailId,
            @ContactNumber,
            @Address,
            @DateOfTravel,
            @NumberOfAdults,
            @NumberOfChildren,
            @Status,
            @PackageId
        );

        SET @BookingId =
            CONVERT(INT,SCOPE_IDENTITY());

        RETURN 1;

    END TRY

    BEGIN CATCH

        RETURN -99;

    END CATCH

END;
GO


/* =========================================================
   PROCEDURE - ADD ACCOMMODATION
   ========================================================= */

CREATE OR ALTER PROCEDURE usp_AddAccommodation
(
    @BookingId INT,
    @City VARCHAR(20),
    @HotelRating INT,
    @Hotels VARCHAR(30),
    @RoomType VARCHAR(20),
    @NoOfRooms INT,
    @EstimatedCost NUMERIC
)
AS
BEGIN

    SET NOCOUNT ON;

    BEGIN TRY

        IF NOT EXISTS
        (
            SELECT 1
            FROM BookPackage
            WHERE BookingId = @BookingId
        )
            RETURN -1;

        IF NOT EXISTS
        (
            SELECT 1
            FROM Hotel
            WHERE HotelName = @Hotels
        )
            RETURN -2;

        IF @HotelRating < 1
           OR @HotelRating > 5
            RETURN -3;

        IF @RoomType NOT IN
        (
            'Single',
            'Double',
            'Deluxe',
            'Suite'
        )
            RETURN -4;

        IF @NoOfRooms <= 0
            RETURN -5;

        INSERT INTO Accomodation
        (
            BookingId,
            City,
            HotelRating,
            HotelName,
            RoomType,
            NoOfRooms,
            Price
        )
        VALUES
        (
            @BookingId,
            @City,
            @HotelRating,
            @Hotels,
            @RoomType,
            @NoOfRooms,
            @EstimatedCost
        );

        RETURN 1;

    END TRY

    BEGIN CATCH

        RETURN -99;

    END CATCH

END;
GO


/* =========================================================
   FUNCTION - GET ACCOMMODATION
   ========================================================= */

CREATE OR ALTER FUNCTION ufn_GetAccommodationByBookingId
(
    @BookingId INT
)
RETURNS TABLE
AS
RETURN
(
    SELECT *
    FROM Accomodation
    WHERE BookingId = @BookingId
);
GO


/* =========================================================
   FUNCTION - VIEW BOOKED PACKAGES
   ========================================================= */

CREATE OR ALTER FUNCTION ufn_ViewBookedPackages
(
    @EmailId VARCHAR(50)
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        BP.BookingId,
        BP.EmailId,
        BP.NumberOfAdults,
        BP.NumberOfChildren,
        BP.DateOfTravel,
        BP.[Status],

        ISNULL(P.TotalAmount,0) AS TotalAmount,

        ISNULL(A.HotelName,'N/A') AS HotelName,

        ISNULL(A.NoOfRooms,0) AS NoOfRooms,

        PD.PlacesToVisit,
        PD.NoOfDays,
        PD.NoOfNights,

        PC.PackageName,
        PC.TypeOfPackage

    FROM BookPackage BP

    LEFT JOIN Payment P
        ON BP.BookingId = P.BookingId

    LEFT JOIN Accomodation A
        ON BP.BookingId = A.BookingId

    LEFT JOIN PackageDetails PD
        ON BP.PackageId = PD.PackageDetailsId

    LEFT JOIN Package PC
        ON PD.PackageId = PC.PackageId

    WHERE BP.EmailId = @EmailId
);
GO


/* =========================================================
   PROCEDURE - VIEW BOOKED PACKAGE
   ========================================================= */

CREATE OR ALTER PROCEDURE usp_ViewBookedPackages
(
    @EmailId VARCHAR(50),

    @BookingId INT OUT,

    @NumberOfAdults INT OUT,

    @NumberOfChildren INT OUT,

    @DateOfTravel DATE OUT,

    @TotalAmount BIGINT OUT,

    @HotelName VARCHAR(50) OUT,

    @NoOfRooms VARCHAR(50) OUT,

    @PlacesToVisit VARCHAR(100) OUT,

    @NoOfDays INT OUT,

    @NoOfNights INT OUT,

    @PackageName VARCHAR(50) OUT
)
AS
BEGIN

    SET NOCOUNT ON;

    BEGIN TRY

        SELECT TOP 1

            @BookingId = BP.BookingId,

            @NumberOfAdults =
                BP.NumberOfAdults,

            @NumberOfChildren =
                BP.NumberOfChildren,

            @DateOfTravel =
                BP.DateOfTravel,

            @TotalAmount =
                P.TotalAmount,

            @HotelName =
                A.HotelName,

            @NoOfRooms =
                CONVERT(VARCHAR(50),A.NoOfRooms),

            @PlacesToVisit =
                PD.PlacesToVisit,

            @NoOfDays =
                PD.NoOfDays,

            @NoOfNights =
                PD.NoOfNights,

            @PackageName =
                PC.PackageName

        FROM BookPackage BP

        LEFT JOIN Payment P
            ON BP.BookingId = P.BookingId

        LEFT JOIN Accomodation A
            ON BP.BookingId = A.BookingId

        LEFT JOIN PackageDetails PD
            ON BP.PackageId = PD.PackageDetailsId

        LEFT JOIN Package PC
            ON PD.PackageId = PC.PackageId

        WHERE BP.EmailId = @EmailId

        ORDER BY BP.BookingId DESC;

        IF @BookingId IS NULL
            RETURN -1;

        RETURN 1;

    END TRY

    BEGIN CATCH

        RETURN -99;

    END CATCH

END;
GO


/* =========================================================
   FUNCTION - BOOKING COST
   ========================================================= */

CREATE OR ALTER FUNCTION ufn_BookingCost
(
    @BookingId INT
)
RETURNS DECIMAL(18,2)
AS
BEGIN

    DECLARE @Cost DECIMAL(18,2);

    SELECT
        @Cost =
            (
                PD.PricePerAdult *
                BP.NumberOfAdults
            )
            +
            (
                PD.PricePerAdult *
                ISNULL(BP.NumberOfChildren,0)
                / 2.0
            )

    FROM BookPackage BP

    INNER JOIN PackageDetails PD
        ON BP.PackageId = PD.PackageDetailsId

    WHERE BP.BookingId = @BookingId;

    RETURN ISNULL(@Cost,0);

END;
GO


/* =========================================================
   TEST PACKAGE FUNCTIONS
   ========================================================= */

SELECT *
FROM ufn_ViewPackageCategory();
GO

SELECT *
FROM ufn_ViewAllPackages();
GO

SELECT *
FROM ufn_ViewPackagesByCategory(100);
GO

SELECT *
FROM ufn_ViewPackageDetail(2000);
GO


/* =========================================================
   TEST ACCOMMODATION
   ========================================================= */

SELECT *
FROM ufn_GetAccommodationByBookingId(4000);
GO


/* =========================================================
   TEST BOOKED PACKAGES
   ========================================================= */

SELECT *
FROM ufn_ViewBookedPackages('Mayank@gmail.com');
GO

SELECT *
FROM ufn_ViewBookedPackages('Sagar@gmail.com');
GO


/* =========================================================
   TEST BOOKING COST
   ========================================================= */

SELECT
    BookingId,
    dbo.ufn_BookingCost(BookingId) AS BookingCost
FROM BookPackage;
GO


/* =========================================================
   TEST CUSTOMER REGISTRATION
   ========================================================= */

EXEC usp_RegisterCustomer
    'testuser@gmail.com',
    'Test',
    'User',
    'test@1234',
    'M',
    9876543213,
    '1998-03-10',
    'Delhi';
GO


/* =========================================================
   TEST CUSTOMER LOGIN
   ========================================================= */

DECLARE @LoginResult INT;

EXEC @LoginResult = usp_Login
    'Mayank@gmail.com',
    'efgh@1234';

SELECT
    @LoginResult AS CustomerLoginResult;
GO


/* =========================================================
   TEST EMPLOYEE LOGIN
   ========================================================= */

DECLARE @EmployeeLoginResult INT;

EXEC @EmployeeLoginResult = usp_LoginEmployee
    'steve@gmail.com',
    'qwertyuiop';

SELECT
    @EmployeeLoginResult AS EmployeeLoginResult;
GO


/* =========================================================
   TEST BOOK PACKAGE PROCEDURE
   ========================================================= */

DECLARE @NewBookingId INT;
DECLARE @BookResult INT;

EXEC @BookResult = usp_BookPackage
    'testuser@gmail.com',
    9876543213,
    'Delhi',
    '2027-06-15',
    2,
    1,
    'Booked',
    900,
    @NewBookingId OUT;

SELECT
    @BookResult AS ReturnValue,
    @NewBookingId AS BookingId;
GO


/* =========================================================
   TEST ADD ACCOMMODATION PROCEDURE
   ========================================================= */

DECLARE @AccommodationResult INT;

EXEC @AccommodationResult = usp_AddAccommodation
    4006,
    'Ooty',
    4,
    'Swosti Grand',
    'Deluxe',
    2,
    10000;

SELECT
    @AccommodationResult AS AccommodationResult;
GO


/* =========================================================
   TEST EDIT PROFILE
   ========================================================= */

DECLARE @EditResult INT;

EXEC @EditResult = usp_EditProfile
    'Mayank@gmail.com',
    'Mayank',
    'Sharma',
    'M',
    2457984315,
    '1999-05-22',
    'New Delhi';

SELECT
    @EditResult AS EditProfileResult;
GO


/* =========================================================
   FINAL DATA CHECK
   ========================================================= */

SELECT * FROM Roles;
GO

SELECT * FROM Customer;
GO

SELECT * FROM PackageCategory;
GO

SELECT * FROM Package;
GO

SELECT * FROM PackageDetails;
GO

SELECT * FROM Hotel;
GO

SELECT * FROM BookPackage;
GO

SELECT * FROM Accomodation;
GO

SELECT * FROM Rating;
GO

SELECT * FROM Vehicle;
GO

SELECT * FROM VehicleBooked;
GO

SELECT * FROM Employee;
GO

SELECT * FROM CustomerCare;
GO

SELECT * FROM Payment;
GO