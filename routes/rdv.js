const express = require("express");
const router = express.Router();
const { Employer, Candidate, Rdv, Offer } = require("../model/schema");
const passport = require("../auth/passport");

//route qui cree un rdv coter employer
router.post("/addRdv", passport, async (req, res) => {
    try {
        const userId = req.user.userId;
        const date = req.body.date;
        const place = req.body.place;
        const candId = req.body.candId;
        const offerId = req.body.offerId;

        const emp = await Employer.findOne({
            where: {
                id: userId,
            },
        });
        const cand = await Candidate.findOne({
            where: {
                id: candId,
            },
        });
        const offer = await Offer.findOne({
            where: {
                id: offerId,
            },
        });

        const rdv = await Rdv.create({
            date: date,
            place: place,
        });

        await rdv.setEmployer(emp);
        await rdv.setCandidate(cand);
        await rdv.setOffer(offer);

        return res.json(true);
    } catch (error) {
        return res.status(404).json(error.message);
    }
});

//route qui recupere tous les rdv coter employer
router.get("/allRdv", passport, async (req, res) => {
    try {
        const userId = req.user.userId;

        const rdv = await Rdv.findAll({
            where: {
                employerId: userId,
            },
            include: [
                {
                    model: Candidate,
                },
                {
                    model: Offer,
                },
            ],
        });
        return res.json(rdv);
    } catch (error) {
        return res.status(404).json(error.message);
    }
});

//route qui recupere tous les rdv coter candidate
router.get("/allRdvCand", passport, async (req, res) => {
    try {
        const userId = req.user.userId;

        const rdv = await Rdv.findAll({
            where: {
                candidateId: userId,
            },
            include: [
                {
                    model: Employer,
                },
                {
                    model: Offer,
                },
            ],
        });
        return res.json(rdv);
    } catch (error) {
        return res.status(404).json(error.message);
    }
});

router.delete("/deleteRdv", passport, async (req, res) => {
    try {
        const rdvId = req.body.rdvId;
        const userId = req.user.userId;

        const rdv = await Rdv.findOne({
            where: {
                id: rdvId,
                employerId: userId,
            },
        });

        if (rdv) {
            await rdv.destroy();
        } else {
            return res.status(404).json({ err: "Le rdv n'existe pas !" });
        }

        return res.json(true);
    } catch (error) {
        return res.status(404).json(error.message);
    }
});

module.exports = router;
