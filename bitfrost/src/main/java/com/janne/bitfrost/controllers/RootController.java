package com.janne.bitfrost.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Random;

@RestController
public class RootController {

    @GetMapping("/api")
    public ResponseEntity<String> statusCheck() {
        String[] bitfrostMotd = {
            "Heimdall is ready to hear your requests.",
            "The Bifröst hums with cosmic energy — step forward, traveler.",
            "Asgard watches — state your purpose.",
            "Heimdall sees all. Your request is expected.",
            "The rainbow bridge is stable. You may proceed.",
            "Odin’s eye is upon you. Speak with honor.",
            "The Bifröst pulses — only the worthy may pass.",
            "Your presence is detected. Heimdall is listening.",
            "The gates of Asgard await. Channel your intent.",
            "Heimdall guards the way. Choose your destination wisely.",
            "Storms gather around Yggdrasil — your path is lit.",
            "The Bifröst opens only for the brave.",
            "Permission granted by the Allfather.",
            "The bridge glows — a sign your request is heard.",
            "Heimdall senses your approach. Proceed with valor.",
            "Welcome, traveler of realms. The Bifröst beckons.",
            "Your essence echoes through the halls of Valaskjálf.",
            "Asgard’s light shines on your journey today.",
            "The sentry of the nine realms awaits your command.",
            "Tread the bridge with honor. Heimdall watches.",
            "A ripple across realms — the bridge acknowledges you.",
            "Heimdall's horn remains silent... for now.",
            "May your request be worthy of the golden gates.",
            "The stars align — the Bifröst is in your favor.",
            "Realm travel initialized. Heimdall approves."
        };

        Random random = new Random();
        int randomIndex = random.nextInt(bitfrostMotd.length);

        return ResponseEntity.ok(bitfrostMotd[randomIndex]);
    }
}
