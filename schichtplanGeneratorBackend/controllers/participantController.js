const Group = require('../models/groupSchema');
const Participant = require('../models/participantSchema');
const User = require('../models/userSchema');

const initParticipant =
{
  participantToken: '',
  displayName: '',
  group: null,
  color: '',
  offDays: [],
  friends: [],
  enemies: [],
  shiftPreferences: 0,
  experience: 0,
  arrivalTime: new Date(),
  departureTime: new Date(),
  absences: [],
  shifts: [],
  shiftsOpenForSwap: [],
  role: 0,
  logs: null,
  config: {
    canEdit: false,
    canSwap: false,
  },
}
exports.getParticipants = async (req, res) => {
  try {
    const { groupId } = req.params;
    const user = await User.findById(req.user.id); // Get the authenticated user's information
    const group = await Group.findById(groupId).populate('participants');
    // check if group is in user's groups
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!user.groups.includes(groupId)) {
      return res.status(403).json({ error: 'You are not authorized to view these participants' });
    }

    const participants = group.participants;

    res.status(200).json(participants);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the participants.' });
  }
};

exports.createParticipant = async (req, res) => {
  try {
    const { groupId } = req.params;
    const user = await User.findById(req.user.id); // Get the authenticated user's information
    const group = await Group.findById(groupId).populate('participants');
    // check if group is in user's groups
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!user.groups.includes(groupId)) {
      return res.status(403).json({ error: 'You are not authorized to create participants for this group' });
    }
    // check if a participant with the same participation token already exists
    group.participants.forEach(participant => {
      if (participant.participantToken === req.body.participantToken) {
        return res.status(400).json({ error: 'A participant with the same participation token already exists' });
      }
    });


    if (req.body.participantToken === '') {
      req.body.participantToken = generateParticipationToken();
    }
    if (req.body.displayName === '') {
      req.body.displayName = getRandomAnimalName();
    }

    if (req.body.color === '') {
      req.body.color = colorGenerator.nextColor(group.participants.map(participant => participant.color));
    }
    const newParticipantObject = { ...initParticipant, ...req.body, group: groupId };
    delete newParticipantObject._id;
    const newParticipant = new Participant(newParticipantObject);
    const participant = await newParticipant.save();

    group.participants.push(participant._id);
    await group.save();
    res.status(201).json(participant);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'An error occurred while creating the participant.' });
  }
};

exports.getParticipantById = async (req, res) => {
  try {
    const { groupId, participantId } = req.params;
    const user = await User.findById(req.user.id); // Get the authenticated user's information
    const group = await Group.findById(groupId);
    // check if group is in user's groups
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!user.groups.includes(groupId)) {
      return res.status(403).json({ error: 'You are not authorized to create participants for this group' });
    }


    const participant = await Participant.findOne({ _id: participantId, group: groupId });

    if (!participant) {
      return res.status(404).json({ message: 'Participant not found.' });
    }

    res.status(200).json(participant);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the participant.' });
  }
};

exports.updateParticipant = async (req, res) => {
  try {
    const { groupId, participantId } = req.params;
    const user = await User.findById(req.user.id); // Get the authenticated user's information
    const group = await Group.findById(groupId);
    // check if group is in user's groups
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!user.groups.includes(groupId)) {
      return res.status(403).json({ error: 'You are not authorized to create participants for this group' });
    }
    const participant = await Participant.findOne(
      { _id: participantId, group: groupId }
    );
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found.' });
    }
    const newParticipantObject = {
      ...participant.toObject(),
      ...req.body,
    }

    const updatedParticipant = await Participant.findOneAndUpdate(
      { _id: participantId, group: groupId },
      newParticipantObject,
      { new: true }
    );


    res.status(200).json(updatedParticipant);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating the participant.' });
  }
};

exports.deleteParticipant = async (req, res) => {
  try {
    const { groupId, participantId } = req.params;
    const user = await User.findById(req.user.id); // Get the authenticated user's information
    const group = await Group.findById(groupId);
    // check if group is in user's groups
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!user.groups.includes(groupId)) {
      return res.status(403).json({ error: 'You are not authorized to create participants for this group' });
    }

    const participant = await Participant.findOneAndDelete({ _id: participantId, group: groupId });

    if (!participant) {
      return res.status(404).json({ message: 'Participant not found.' });
    }

    res.status(200).json({ message: 'Participant deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while deleting the participant.' });
  }
};


const generateParticipationToken = () => {
  return Math.random().toString(36).substring(3, 7).toUpperCase().padStart(4, '0');
}

const getRandomAnimalName = () => {
  const animalNames = [
    "Aardvark",
    "Albatross",
    "Alligator",
    "Alpaca",
    "Ant",
    "Antelope",
    "Ape",
    "Armadillo",
    "Baboon",
    "Badger",
    "Barracuda",
    "Bat",
    "Bear",
    "Beaver",
    "Bee",
    "Bison",
    "Boar",
    "Buffalo",
    "Butterfly",
    "Camel",
    "Capybara",
    "Caribou",
    "Cassowary",
    "Cat",
    "Caterpillar",
    "Cattle",
    "Chamois",
    "Cheetah",
    "Chicken",
    "Chimpanzee",
    "Chinchilla",
    "Chough",
    "Coati",
    "Cobra",
    "Cockroach",
    "Cod",
    "Cormorant",
    "Coyote",
    "Crab",
    "Crane",
    "Crocodile",
    "Crow",
    "Curlew",
    "Deer",
    "Dinosaur",
    "Dog",
    "Dogfish",
    "Dolphin",
    "Donkey",
    "Dotterel",
    "Dove",
    "Dragonfly",
    "Duck",
    "Dugong",
    "Dunlin",
    "Eagle",
    "Echidna",
    "Eel",
    "Eland",
    "Elephant",
    "Elk",
    "Emu",
    "Falcon",
    "Ferret",
    "Finch",
    "Fish",
    "Flamingo",
    "Fly",
    "Fox",
    "Frog",
    "Gaur",
    "Gazelle",
    "Gerbil",
    "Giraffe",
    "Gnat",
    "Gnu",
    "Goat",
    "Goldfinch",
    "Goldfish",
    "Goose",
    "Gorilla",
    "Goshawk",
    "Grasshopper",
    "Grouse",
    "Guanaco",
    "Gull",
    "Hamster",
    "Hare",
    "Hawk",
    "Hedgehog",
    "Heron",
    "Herring",
    "Hippopotamus",
    "Hornet",
    "Horse",
    "Human",
    "Hummingbird",
    "Hyena",
    "Ibex",
    "Ibis",
    "Jackal",
    "Jaguar",
    "Jay",
    "Jellyfish",
    "Kangaroo",
    "Kingfisher",
    "Koala",
    "Kookaburra",
    "Kouprey",
    "Kudu",
    "Lapwing",
    "Lark",
    "Lemur",
    "Leopard",
    "Lion",
    "Llama",
    "Lobster",
    "Locust",
    "Loris",
    "Louse",
    "Lyrebird",
    "Magpie",
    "Mallard",
    "Manatee",
    "Mandrill",
    "Mantis",
    "Marten",
    "Meerkat",
    "Mink",
    "Mole",
    "Mongoose",
    "Monkey",
    "Moose",
    "Mosquito",
    "Mouse",
    "Mule"
  ];

  return animalNames[Math.floor(Math.random() * animalNames.length)];
}


class ColorGenerator {
  constructor() {
    this.count = 0;
    this.goldenRatio = 0.618033988749895;
  }

  hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  }

  nextColor(existingColors) {
    const hue = (this.count * this.goldenRatio) % 1; // Hue value between 0 and 1
    const [r, g, b] = this.hslToRgb(hue, 0.5, 0.6);
    const hexColor = this.rgbToHex(r, g, b);
    this.count++;
    if (existingColors.includes(hexColor)) {
      return this.nextColor(existingColors);
    } else {
      return hexColor;
    }
  }
}

const colorGenerator = new ColorGenerator();