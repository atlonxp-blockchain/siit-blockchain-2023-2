import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis, VictoryLabel } from 'victory-native';

const Detail = ({ route }) => {
  const { poll } = route.params;

  const calculateConclusion = () => {
    const totalVotes = poll.choices.reduce((sum, choice) => sum + choice.votes, 0);
    const conclusion = poll.choices.map((choice) => {
      const percentage = totalVotes === 0 ? 0 : (choice.votes / totalVotes) * 100;
      return {
        label: choice.label,
        percentage,
      };
    });

    return { conclusion, totalVotes };
  };

  const { conclusion, totalVotes } = calculateConclusion();

  const maxPercentageChoice = conclusion.reduce((maxChoice, currentChoice) =>
    currentChoice.percentage > maxChoice.percentage ? currentChoice : maxChoice
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pollTitle}>{poll.title}</Text>
      {poll.image && <Image source={{ uri: poll.image }} style={styles.pollImage} />}
      <VictoryChart theme={VictoryTheme.material} domainPadding={{ y: 20, x: 20 }} height={250}>
        <VictoryBar
          data={conclusion}
          x="label"
          y="percentage"
          style={{
            data: {
              fill: ({ datum }) =>
                datum.label === maxPercentageChoice.label ? '#f28159' : '#293764', 
            },
          }}
          horizontal
          barWidth={20}
        />
        <VictoryAxis
          dependentAxis
          label="%"
          tickFormat={(tick) => Math.round(tick)} 
          style={{
            axisLabel: { padding: 30 },
          }}
          axisLabelComponent={<VictoryLabel dy={30} />} 
        />
      </VictoryChart>
      <Text style={styles.conclusionText}>Result:</Text>
      {conclusion.map((choice, index) => (
        <Text
          key={choice.label}
          style={[
            styles.choiceText,
            { color: choice.label === maxPercentageChoice.label ? '#f28159' : 'black' }, 
          ]}
        >
          {choice.label}: {choice.percentage.toFixed(2)}%
        </Text>
      ))}
      <Text style={styles.totalVotesText}>Total Votes: {totalVotes}</Text>
    </ScrollView>
  );
};

const styles = {
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    backgroundColor: '#ffffff',
  },
  pollTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 10,
  },
  pollImage: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  conclusionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  choiceText: {
    fontSize: 16,
    marginBottom: 5,
  },
  totalVotesText: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
};

export default Detail;
