// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HederaIdentiFi {
    struct User {
        string firstName;
        string lastName;
        string username;
        string email;
        string homeAddress;
        string dateOfBirth;
        string education;
        string workHistory;
        string phoneNumber;
        string jobTitle;
        string x;
        string instagram;
        string tiktok;
        string youtube;
        string linkedin;
        string info;
        string[] skills;
        string imageURL;
        bool exists;
        uint[] appliedJobs; 
        Visibility visibility;
    }

    struct Visibility {
        bool education;
        bool workHistory;
        bool phoneNumber;
        bool homeAddress;
        bool dateOfBirth;
    }

    struct BasicInfo {
        string firstName;
        string lastName;
        string email;
        string homeAddress;
        string dateOfBirth;
        string phoneNumber;
    }

    struct SocialLinks {
        string x;
        string instagram;
        string tiktok;
        string youtube;
        string linkedin;
    }

    struct ProfessionalInfo {
        string education;
        string workHistory;
        string jobTitle;
        string info;
        string[] skills;
        string imageURL;
    }

    // Mappings for users
    mapping(string => User) private users;
    mapping(address => string) private addressToUsername;
    mapping(string => bool) private usernames; // Ensures username uniqueness

    // Event declarations
    event UserCreated(string username, address userAddress);
    event UserEdited(string username);
    event VisibilitySet(string username, Visibility visibility);
    event StateUpdated(string newState);

    modifier onlyUniqueUsername(string memory username) {
        require(!usernames[username], "Username already exists.");
        _;
    }

    // Create a new user on Hedera Network
    function createUser(
        string memory username,
        BasicInfo memory basicInfo,
        ProfessionalInfo memory professionalInfo,
        SocialLinks memory socialLinks,
        Visibility memory visibility
    ) public onlyUniqueUsername(username) {
        User storage user = users[username];
        user.firstName = basicInfo.firstName;
        user.lastName = basicInfo.lastName;
        user.username = username;
        user.email = basicInfo.email;
        user.homeAddress = basicInfo.homeAddress;
        user.dateOfBirth = basicInfo.dateOfBirth;
        user.phoneNumber = basicInfo.phoneNumber;
        user.education = professionalInfo.education;
        user.workHistory = professionalInfo.workHistory;
        user.jobTitle = professionalInfo.jobTitle;
        user.x = socialLinks.x;
        user.instagram = socialLinks.instagram;
        user.tiktok = socialLinks.tiktok;
        user.youtube = socialLinks.youtube;
        user.linkedin = socialLinks.linkedin;
        user.info = professionalInfo.info;
        user.skills = professionalInfo.skills;
        user.imageURL = professionalInfo.imageURL;
        user.exists = true;
        user.visibility = visibility;
        usernames[username] = true;
        addressToUsername[msg.sender] = username;

        emit UserCreated(username, msg.sender); // Emit event after user creation
    }

    // Edit user information
    function editUser(
        string memory username,
        BasicInfo memory basicInfo,
        ProfessionalInfo memory professionalInfo,
        SocialLinks memory socialLinks,
        Visibility memory visibility
    ) public {
        require(users[username].exists, "User does not exist.");
        User storage user = users[username];
        user.firstName = basicInfo.firstName;
        user.lastName = basicInfo.lastName;
        user.email = basicInfo.email;
        user.homeAddress = basicInfo.homeAddress;
        user.dateOfBirth = basicInfo.dateOfBirth;
        user.phoneNumber = basicInfo.phoneNumber;
        user.education = professionalInfo.education;
        user.workHistory = professionalInfo.workHistory;
        user.jobTitle = professionalInfo.jobTitle;
        user.x = socialLinks.x;
        user.instagram = socialLinks.instagram;
        user.tiktok = socialLinks.tiktok;
        user.youtube = socialLinks.youtube;
        user.linkedin = socialLinks.linkedin;
        user.info = professionalInfo.info;
        user.skills = professionalInfo.skills;
        user.imageURL = professionalInfo.imageURL;
        user.visibility = visibility;

        emit UserEdited(username); // Emit event after user is edited
    }

    // Get user by username
    function getUserByUsername(string memory username) public view returns (
        BasicInfo memory basicInfo,
        ProfessionalInfo memory professionalInfo,
        SocialLinks memory socialLinks,
        Visibility memory visibility
    ) {
        require(users[username].exists, "User does not exist.");
        User storage user = users[username];
        basicInfo = BasicInfo(
            user.firstName,
            user.lastName,
            user.email,
            user.homeAddress,
            user.dateOfBirth,
            user.phoneNumber
        );
        professionalInfo = ProfessionalInfo(
            user.education,
            user.workHistory,
            user.jobTitle,
            user.info,
            user.skills,
            user.imageURL
        );
        socialLinks = SocialLinks(
            user.x,
            user.instagram,
            user.tiktok,
            user.youtube,
            user.linkedin
        );
        visibility = user.visibility;
        return (basicInfo, professionalInfo, socialLinks, visibility);
    }

    // Get user by address
    function getUserByAddress(address userAddress) public view returns (
        BasicInfo memory basicInfo,
        ProfessionalInfo memory professionalInfo,
        SocialLinks memory socialLinks,
        Visibility memory visibility
    ) {
        string memory username = addressToUsername[userAddress];
        return getUserByUsername(username);
    }

    // Set visibility settings for a user
    function setVisibility(
        string memory username, 
        bool education,
        bool workHistory,
        bool phoneNumber,
        bool homeAddress,
        bool dateOfBirth
    ) public {
        require(users[username].exists, "User does not exist.");
        User storage user = users[username];
        user.visibility.education = education;
        user.visibility.workHistory = workHistory;
        user.visibility.phoneNumber = phoneNumber;
        user.visibility.homeAddress = homeAddress;
        user.visibility.dateOfBirth = dateOfBirth;

        emit VisibilitySet(username, user.visibility); // Emit event after setting visibility
    }

    // Get visibility of a user
    function getVisibility(string memory username) public view returns (Visibility memory) {
        require(users[username].exists, "User does not exist.");
        return users[username].visibility;
    }

    string private state;  // State variable

    // Update the state of the contract
    function updateState(string memory newState) public {
        state = newState;
        emit StateUpdated(newState); // Emit event after updating state
    }

    // Get the current state
    function getState() public view returns (string memory) {
        return state;
    }
}


/* This contract was deployed using remix. Details below


[block:8078094 txIndex:4]from: 0x3d9...c06f6to: HederaIdentiFi.(fallback) 0xe02...5ff94value: 0 weidata: 0x608...20033logs: 0hash: 0x1ee...10b9a
status	0x1 Transaction mined and execution succeed

transaction hash	0xa1e2a0733b3e3ea0da8161ff82fab636427e9df524f60482531279db21aa61f8

block hash	0x1ee9aa57d285570ca000468494220cc29d2ce780d350d7535e89fb8207c10b9a

block number	8078094

contract address	0xe0266566d99d2e542009c39727a7c6e74565ff94
from	0x3d9a5e670b435ea5cdc92c852e43c9e94adc06f6
to	HederaIdentiFi.(fallback) 0xe0266566d99d2e542009c39727a7c6e74565ff94

gas	236133 gas

transaction cost	236133 gas 

input	0x608...20033

decoded input	-

decoded output	 - 

logs	[] */