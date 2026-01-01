import React, { useState } from 'react';
import { Dimensions, Pressable, View as RNView, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text, View } from '@/components/Themed';
import { useExplorations } from '@/hooks/useExplorations';
import { getDayOfYear } from '@/types/types';

const { width } = Dimensions.get('window');
const PADDING = 20;
const CELL_SIZE = Math.floor((width - PADDING * 2) / 7);

const COLORS = {
  bg: '#09090B',
  card: '#18181B',
  border: '#27272A',
  text: '#FAFAFA',
  textMuted: '#52525B',
  blue: '#2665f1',
  cyan: '#22D3EE',
  green: '#4ADE80',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function CalendarScreen() {
  const { explorations } = useExplorations();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const year = new Date().getFullYear();

  const monthExplorations = explorations.filter(exp => {
    const date = new Date(exp.date);
    return date.getMonth() === selectedMonth && date.getFullYear() === year;
  });

  const dayMap = new Map<number, number>();
  monthExplorations.forEach(exp => {
    const day = new Date(exp.date).getDate();
    dayMap.set(day, (dayMap.get(day) || 0) + 1);
  });

  // Generate calendar weeks (array of 7-day rows)
  const getCalendarWeeks = () => {
    const firstDay = new Date(year, selectedMonth, 1).getDay();
    const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate();
    const weeks: (number | null)[][] = [];
    let currentWeek: (number | null)[] = [];
    
    // Fill in empty days before the 1st
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push(null);
    }
    
    // Fill in the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    // Fill remaining days in last week
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  const calendarWeeks = getCalendarWeeks();
  const today = new Date();
  const isCurrentMonth = today.getMonth() === selectedMonth && today.getFullYear() === year;
  const currentDay = today.getDate();
  const currentDayOfYear = getDayOfYear(today);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <Text style={styles.headerSubtitle}>Day {currentDayOfYear} · {year}</Text>
      </View>

      {/* Month Selector */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.monthSelector}
        contentContainerStyle={styles.monthSelectorContent}
      >
        {MONTHS.map((month, index) => (
          <Pressable
            key={month}
            onPress={() => setSelectedMonth(index)}
            style={[
              styles.monthButton,
              index === selectedMonth && styles.monthButtonActive,
            ]}
          >
            <Text style={[
              styles.monthButtonText,
              index === selectedMonth && styles.monthButtonTextActive,
            ]}>
              {month}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Calendar Grid */}
      <View style={styles.calendarContainer}>
        {/* Day Headers Row */}
        <RNView style={styles.weekRow}>
          {DAYS.map((day, index) => (
            <RNView key={index} style={styles.dayCell}>
              <Text style={styles.dayHeaderText}>{day}</Text>
            </RNView>
          ))}
        </RNView>

        {/* Calendar Weeks */}
        {calendarWeeks.map((week, weekIndex) => (
          <RNView key={weekIndex} style={styles.weekRow}>
            {week.map((day, dayIndex) => {
              const count = day ? dayMap.get(day) || 0 : 0;
              const isToday = isCurrentMonth && day === currentDay;
              const hasActivity = count > 0;
              
              return (
                <RNView key={dayIndex} style={styles.dayCell}>
                  {day !== null && (
                    <RNView style={[
                      styles.dayCellInner,
                      isToday && styles.todayCell,
                    ]}>
                      <Text style={[
                        styles.dayText,
                        hasActivity && styles.dayTextActive,
                        isToday && styles.todayText,
                      ]}>
                        {day}
                      </Text>
                      {hasActivity && !isToday && (
                        <RNView style={styles.activityDot} />
                      )}
                    </RNView>
                  )}
                </RNView>
              );
            })}
          </RNView>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: COLORS.blue }]}>{monthExplorations.length}</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: COLORS.cyan }]}>{explorations.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: COLORS.green }]}>
            {explorations.filter(e => e.status === 'completed').length}
          </Text>
          <Text style={styles.statLabel}>Done</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    paddingHorizontal: PADDING,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  monthSelector: {
    maxHeight: 40,
    marginBottom: 24,
  },
  monthSelectorContent: {
    paddingHorizontal: PADDING,
  },
  monthButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthButtonActive: {
    backgroundColor: COLORS.blue + '20',
  },
  monthButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  monthButtonTextActive: {
    color: COLORS.blue,
  },
  calendarContainer: {
    paddingHorizontal: PADDING,
    backgroundColor: 'transparent',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dayCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCellInner: {
    width: CELL_SIZE - 8,
    height: CELL_SIZE - 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  todayCell: {
    backgroundColor: COLORS.blue,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  dayText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  dayTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  todayText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  activityDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.blue,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 32,
    marginHorizontal: PADDING,
    padding: 20,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
