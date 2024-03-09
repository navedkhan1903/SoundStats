$(function() {
  document.getElementById("link_generator").onclick = function() {
    window.open(
      "https://accounts.spotify.com/authorize?client_id=5ebe6b29a94c43eeb51506e1f64294c1&redirect_uri=https%3A%2F%2Fspotifyanalysistool.netlify.app%2F&response_type=token&state=123",
      "_self"
    );
    let track_link = document
      .getElementById("track_link")
      .value.split("/")[4]
      .split("?")[0];
    localStorage.setItem("track", track_link);

    let ref_link = document
      .getElementById("ref_link")
      .value.split("/")[4]
      .split("?")[0];
    localStorage.setItem("ref", ref_link);
  };
  var access_token = window.location.href.split("=")[1].split("&")[0];
  var track_link = localStorage.getItem("track");
  var ref_link = localStorage.getItem("ref");

  var track_data;
  fetch("https://api.spotify.com/v1/audio-features/" + track_link, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + access_token,
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(data => (track_data = data));

  var ref_data;
  fetch("https://api.spotify.com/v1/audio-features/" + ref_link, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + access_token,
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(data => (ref_data = data));

  var track_name;
  fetch("https://api.spotify.com/v1/tracks/" + track_link, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + access_token,
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(data => (track_name = data));

  var ref_name;
  fetch("https://api.spotify.com/v1/tracks/" + ref_link, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + access_token,
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(data => (ref_name = data));

  function checkData() {
    if (
      track_data == null ||
      ref_data == null ||
      track_name == null ||
      ref_name == null
    ) {
      window.setTimeout(checkData, 100);
    } else {
      var track_danceability = track_data.danceability * 100;
      var track_energy = track_data.energy * 100;
      var track_speechiness = track_data.speechiness * 100;
      var track_acousticness = track_data.acousticness * 100;
      var track_instrumentalness = track_data.instrumentalness * 100;
      var track_liveness = track_data.liveness * 100;
      var track_valence = track_data.valence * 100;
      var track_tempo = track_data.tempo;

      var ref_danceability = ref_data.danceability * 100;
      var ref_energy = ref_data.energy * 100;
      var ref_speechiness = ref_data.speechiness * 100;
      var ref_acousticness = ref_data.acousticness * 100;
      var ref_instrumentalness = ref_data.instrumentalness * 100;
      var ref_liveness = ref_data.liveness * 100;
      var ref_valence = ref_data.valence * 100;
      var ref_tempo = ref_data.tempo;

      Chart.defaults.global.defaultFontFamily = "Poppins, sans-serif";
      Chart.defaults.global.defaultFontSize = 16;
      Chart.defaults.global.defaultFontColor = "#212121";
      var myChart = new Chart(document.getElementById("bar-chart-grouped"), {
        type: "horizontalBar",
        data: {
          labels: [
            "Danceability",
            "Energy",
            "Speechiness",
            "Acousticness",
            " Instrumentalness",
            "Liveness",
            "Valence",
            "Tempo",
            "Popularity"
          ],
          datasets: [
            {
              label: track_name.name,
              backgroundColor: "#333333",
              borderColor: "#212121",
              borderWidth: 1,
              data: [
                track_danceability,
                track_energy,
                track_speechiness,
                track_acousticness,
                track_instrumentalness,
                track_liveness,
                track_valence,
                track_tempo,
                track_name.popularity
              ]
            },
            {
              label: ref_name.name,
              backgroundColor: "#1db954",
              borderColor: "#1aa34a",
              borderWidth: 1,
              data: [
                ref_danceability,
                ref_energy,
                ref_speechiness,
                ref_acousticness,
                ref_instrumentalness,
                ref_liveness,
                ref_valence,
                ref_tempo,
                ref_name.popularity
              ]
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: "Audio features Comparison"
          },
          scales: {
            yAxes: [
              {
                gridLines: {
                  display: false
                }
              }
            ]
          }
        }
      });
      var Ex =
        track_danceability +
        track_energy +
        track_speechiness +
        track_acousticness +
        track_instrumentalness +
        track_liveness +
        track_valence +
        track_tempo;

      var Ey =
        ref_danceability +
        ref_energy +
        ref_speechiness +
        ref_acousticness +
        ref_instrumentalness +
        ref_liveness +
        ref_valence +
        ref_tempo;

      var Mx = Ex / 8;
      var My = Ey / 8;

      var Ssx =
        (track_danceability - Mx) ** 2 +
        (track_energy - Mx) ** 2 +
        (track_speechiness - Mx) ** 2 +
        (track_acousticness - Mx) ** 2 +
        (track_instrumentalness - Mx) ** 2 +
        (track_liveness - Mx) ** 2 +
        (track_valence - Mx) ** 2 +
        (track_tempo - Mx) ** 2;

      var Ssy =
        (ref_danceability - My) ** 2 +
        (ref_energy - My) ** 2 +
        (ref_speechiness - My) ** 2 +
        (ref_acousticness - My) ** 2 +
        (ref_instrumentalness - My) ** 2 +
        (ref_liveness - My) ** 2 +
        (ref_valence - My) ** 2 +
        (ref_tempo - My) ** 2;

      var deviation_scores =
        (track_danceability - Mx) * (ref_danceability - My) +
        (track_energy - Mx) * (ref_energy - My) +
        (track_speechiness - Mx) * (ref_speechiness - My) +
        (track_acousticness - Mx) * (ref_acousticness - My) +
        (track_instrumentalness - Mx) * (ref_instrumentalness - My) +
        (track_liveness - Mx) * (ref_liveness - My) +
        (track_valence - Mx) * (ref_valence - My) +
        (track_tempo - Mx) * (ref_tempo - My);

      var r = deviation_scores / Math.sqrt(Ssx * Ssy);
      var r_new = Math.round(r * 10) / 10;
      document.getElementById("r_print").innerHTML = r_new;
      if (r_new == 1.0 || r_new == 0.9) {
        document.getElementById("r_print").style.color = "#1DB954";
      } else if (r_new == 0.8 || r_new == 0.7) {
        document.getElementById("r_print").style.color = "#2DAC50";
      } else if (r_new == 0.6 || r_new == 0.5) {
        document.getElementById("r_print").style.color = "#3E9F4C";
      } else if (r_new == 0.4 || r_new == 0.3) {
        document.getElementById("r_print").style.color = "#4E9348";
      } else if (r_new == 0.2 || r_new == 0.1) {
        document.getElementById("r_print").style.color = "#5E8644";
      } else if (r_new == 0.0 || r_new == -0.1) {
        document.getElementById("r_print").style.color = "#6F7940";
      } else if (r_new == -0.2 || r_new == -0.3) {
        document.getElementById("r_print").style.color = "#7F6C3B";
      } else if (r_new == -0.4 || r_new == -0.5) {
        document.getElementById("r_print").style.color = "#8F5F37";
      } else if (r_new == -0.6 || r_new == -0.7) {
        document.getElementById("r_print").style.color = "#9F5333";
      } else if (r_new == -0.8 || r_new == -0.9) {
        document.getElementById("r_print").style.color = "#B0462F";
      } else if (r_new == -1.0) {
        document.getElementById("r_print").style.color = "#C0392B";
      }

      var slope = deviation_scores / Ssx;
      var intercept = My - slope * Mx;

      var scatterChart = new Chart(document.getElementById("scatter"), {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "Audio features values",
              backgroundColor: "#1db954",
              data: [
                {
                  x: track_danceability,
                  y: ref_danceability
                },
                {
                  x: track_energy,
                  y: ref_energy
                },
                {
                  x: track_speechiness,
                  y: ref_speechiness
                },
                {
                  x: track_acousticness,
                  y: ref_acousticness
                },
                {
                  x: track_instrumentalness,
                  y: ref_instrumentalness
                },
                {
                  x: track_liveness,
                  y: ref_liveness
                },
                {
                  x: track_valence,
                  y: ref_valence
                },
                {
                  x: track_tempo,
                  y: ref_tempo
                }
              ]
            },
            {
              type: "line",
              label: "Calculated Regression Line",
              fill: false,
              backgroundColor: "#3498db",
              borderColor: "#3498db",
              pointRadius: 0,
              data: [
                {
                  x: 0,
                  y: intercept
                },
                {
                  x:
                    (slope *
                      Math.max(
                        track_danceability,
                        track_energy,
                        track_speechiness,
                        track_acousticness,
                        track_instrumentalness,
                        track_liveness,
                        track_valence,
                        track_tempo
                      ) +
                      intercept -
                      intercept) /
                    slope,
                  y:
                    slope *
                      Math.max(
                        track_danceability,
                        track_energy,
                        track_speechiness,
                        track_acousticness,
                        track_instrumentalness,
                        track_liveness,
                        track_valence,
                        track_tempo
                      ) +
                    intercept
                }
              ]
            },
            {
              type: "line",
              label: "Expected Regression Line",
              fill: false,
              backgroundColor: "#333333",
              borderColor: "#212121",
              pointRadius: 0,
              data: [
                {
                  x: 0,
                  y: 0
                },
                {
                  x: Math.max(
                    track_danceability,
                    track_energy,
                    track_speechiness,
                    track_acousticness,
                    track_instrumentalness,
                    track_liveness,
                    track_valence,
                    track_tempo
                  ),
                  y: Math.max(
                    track_danceability,
                    track_energy,
                    track_speechiness,
                    track_acousticness,
                    track_instrumentalness,
                    track_liveness,
                    track_valence,
                    track_tempo
                  )
                }
              ]
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: "Audio features - Linear Regression Graph"
          },
          scales: {
            xAxes: [
              {
                type: "linear",
                position: "bottom"
              },
              {
                scaleLabel: {
                  display: true,
                  labelString:
                    "More deviated the Calculated Regression Line is from"
                }
              },
              {
                scaleLabel: {
                  display: true,
                  labelString:
                    "the Expected Regression Line, lesser is the correlation between"
                }
              },
              {
                scaleLabel: {
                  display: true,
                  labelString:
                    "audio features of your song and the reference track."
                }
              }
            ]
          }
        }
      });
    }
  }
  checkData();
});
