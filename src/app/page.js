// @ts-nocheck
"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import debounce from "lodash.debounce";
import useGoogleSheets from "use-google-sheets";
import ClipLoader from "react-spinners/ClipLoader";
import { useState } from "react";
import Image from "next/image";
import packageJson from "/package.json";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

export default function Home({ config }) {
  const [enemies, setEnemies] = React.useState([]);
  let [color, setColor] = useState("#ffffff");

  const { data, loading, error } = useGoogleSheets({
    apiKey: config.apiKey,
    sheetId: config.sheetId,
  });

  const populateEnemies = (searchText, skipMatch) => {
    if (!loading) {
      const result = [];
      data.forEach((team) => {
        const players = team.data;
        players.forEach((player) => {
          const currentPlayerName = player["Player Name"];
          if (
            currentPlayerName
              .toLocaleLowerCase()
              .includes(searchText.toLocaleLowerCase() || skipMatch)
          ) {
            const playerLocal = player;
            let coms = "";

            for (let index = 1; index < 10; index++) {
              const currentColumn = `Commander ${index}`;
              if (playerLocal[currentColumn]) {
                coms += `${playerLocal[currentColumn]} `;
              }
            }
            if (coms !== "") {
              result.push({
                name: currentPlayerName,
                coms,
                team: team.id,
                rating: playerLocal["Gear Rating (0-5)"],
              });
            }
          }
        });
        setEnemies(result);
      });
    }
  };

  const search = function (e) {
    setEnemies([]);
    const searchText = e.target.value.trim();
    populateEnemies(searchText, false);
  };
  const processChange = debounce((e) => search(e), 200);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center p-5">
        <Image
          src="/mg.png"
        
          width={250}
          height={250}
          alt="Picture of the author"
        />
        <label> Current version : {packageJson.version}</label>
        <ClipLoader
          color={color}
          loading={loading}
          cssOverride={override}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </main>
    );
  } else {
    return (
      <main className="flex min-h-screen flex-col items-center enemy-tracker">
        <Image src="/mg.png" width={250} height={250} alt="Lord" />
        <label> Current version : {packageJson.version}</label>
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <Card sx={{ minWidth: 275 }}>
            <h1> Search:</h1>
            <input
              autoFocus
              id="search-box"
              className="search-box"
              type="text"
              placeholder="Player name..."
              onChange={processChange.bind(this)}
            />
          </Card>
        </div>
        <br></br>
        <br></br>
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex"></div>
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <div>
            <Card sx={{ minWidth: 275 }}>
              <h1> Results:</h1>
              <ul className="enemy-list">
                {enemies.map((enemy, i) => (
                  <li key={i}>
                    Name:{" "}
                    <span className="enemy-text-right">
                      <b>{enemy.name}</b>
                    </span>
                    <br></br>
                    Commanders:
                    <span className="enemy-text-right">
                      <b> {enemy.coms}</b>
                    </span>
                    <br></br>
                    Gear Rating (0-5):{" "}
                    <span className="enemy-text-right">
                      <b>{enemy.rating}</b>
                    </span>
                    <br></br>
                    Team:{" "}
                    <span className="enemy-text-right">
                      <b>{enemy.team}</b>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </main>
    );
  }
}
