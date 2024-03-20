var axios = require("axios");
var FormData = require("form-data");

var celebrityOptions = [
    'Homer Simpson from The Simpsons',
    'The Rock (Dwayne Johnson)',
    'Joe Rogan from The Joe Rogan Experience',
    'Darth Vader from Star Wars',
    'The rapper Snoop Dogg',
    'radio host Howard Stern',
    'Tony Stark (Iron Man)',
    'Peter Griffin from Family Guy',
    'Elon Musk ',
    'Spongebob Squarepants',
    'Sherlock Holmes',
    'Batman',
    'Jimmy Fallon',
    'Socrates',
    'Santa Claus'
];

var postData = async (index, input) => {
    try {
        var selectedCelebrity = celebrityOptions[index];
        var formData = new FormData();
        formData.append('message', input);
        formData.append('intro', selectedCelebrity);
        formData.append('name', selectedCelebrity);
        var response2 = await axios.post('https://boredhumans.com/api_celeb_chat.php', formData);
        return response2.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

var danz = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    try {
        var text;
        if (args.length >= 1) {
            text = args.slice(0).join(" ");
        } else if (m.quoted && m.quoted.text) {
            text = m.quoted.text;
        } else {
            console.log('Select a celebrity by entering the corresponding number:');
            var celebrityList = celebrityOptions.map((celebrity, index) => `${index + 1}. ${celebrity}`);
            var listMessage = `Select a celebrity:\n${celebrityList.join('\n')}`;
            await m.reply(listMessage);
            return;
        }

        await m.reply(wait);

        var inputArray = text.split('|');
        if (inputArray.length !== 2) {
            var errorMessage = 'Invalid input format. Please use "index|input".';
            await m.reply(errorMessage);
            var helpMessage = 'Please use the format: index|input. For example: 3|Hello';
            await m.reply(helpMessage);
        } else {
            var selectedIndex = parseInt(inputArray[0]);
            var userInput = inputArray[1];

            if (!isNaN(selectedIndex) && selectedIndex >= 1 && selectedIndex <= celebrityOptions.length) {
                var result = await postData(selectedIndex - 1, userInput);
                await m.reply(result.output);
            } else {
                var errorMessage = 'Invalid selection. Please enter a valid number.';
                await m.reply(errorMessage);
                var helpMessage = 'Please use the format: index|input. For example: 3|Hello';
                await m.reply(helpMessage);
            }
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    }
};

danz.command = danz.help = ["boredchat"];
danz.tags = ["tools"];

module.exports = danz;