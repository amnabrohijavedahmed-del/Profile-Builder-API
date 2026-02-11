const express = require('express');
const bodyParser = require('body-parser');
const Joi = require('joi');

const app = express();
app.use(bodyParser.json());

let profiles = [];


const profileSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    age: Joi.number().integer().min(1).max(120).required(),
    bio: Joi.string().max(500).optional()
});

app.get('/profiles', (req, res) => {
    res.json(profiles);
});


app.get('/profiles/:id', (req, res) => {
    const profile = profiles.find(p => p.id === parseInt(req.params.id));
    if (!profile) return res.status(404).send('Profile not found.');
    res.json(profile);
});


app.post('/profiles', (req, res) => {
    const { error } = profileSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newProfile = {
        id: profiles.length + 1,
        ...req.body
    };
    profiles.push(newProfile);
    res.status(201).json(newProfile);
});


app.put('/profiles/:id', (req, res) => {
    const profile = profiles.find(p => p.id === parseInt(req.params.id));
    if (!profile) return res.status(404).send('Profile not found.');

    const { error } = profileSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    Object.assign(profile, req.body);
    res.json(profile);
});

app.delete('/profiles/:id', (req, res) => {
    const index = profiles.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).send('Profile not found.');

    const deletedProfile = profiles.splice(index, 1);
    res.json(deletedProfile[0]);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
