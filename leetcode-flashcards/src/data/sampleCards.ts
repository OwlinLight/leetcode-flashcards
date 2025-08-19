import { Flashcard } from '@/types/flashcard';

export const sampleCards: Flashcard[] = [
  {
    id: '1',
    title: 'Two Sum',
    problem: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    solution: `def twoSum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []`,
    explanation: 'Use a hash map to store numbers and their indices. For each number, check if its complement (target - current number) exists in the map.',
    difficulty: 'easy',
    tags: ['array', 'hash-table'],
    status: 'new',
    createdAt: new Date(),
    nextReview: new Date(),
    interval: 1,
    easeFactor: 2.5,
    reviewCount: 0
  },
  {
    id: '2',
    title: 'Valid Parentheses',
    problem: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order.',
    solution: `def isValid(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    
    for char in s:
        if char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            stack.append(char)
    
    return not stack`,
    explanation: 'Use a stack to track opening brackets. When encountering a closing bracket, check if it matches the most recent opening bracket.',
    difficulty: 'easy',
    tags: ['string', 'stack'],
    status: 'new',
    createdAt: new Date(),
    nextReview: new Date(),
    interval: 1,
    easeFactor: 2.5,
    reviewCount: 0
  },
  {
    id: '3',
    title: 'Longest Substring Without Repeating Characters',
    problem: 'Given a string s, find the length of the longest substring without repeating characters.',
    solution: `def lengthOfLongestSubstring(s):
    char_map = {}
    left = 0
    max_length = 0
    
    for right in range(len(s)):
        if s[right] in char_map and char_map[s[right]] >= left:
            left = char_map[s[right]] + 1
        
        char_map[s[right]] = right
        max_length = max(max_length, right - left + 1)
    
    return max_length`,
    explanation: 'Use sliding window technique with two pointers. Maintain a hash map to track character positions and adjust the left pointer when duplicates are found.',
    difficulty: 'medium',
    tags: ['string', 'sliding-window', 'hash-table'],
    status: 'new',
    createdAt: new Date(),
    nextReview: new Date(),
    interval: 1,
    easeFactor: 2.5,
    reviewCount: 0
  },
  {
    id: '4',
    title: 'Merge Two Sorted Lists',
    problem: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a sorted manner and return the head of the merged linked list.',
    solution: `def mergeTwoLists(list1, list2):
    dummy = ListNode(0)
    current = dummy
    
    while list1 and list2:
        if list1.val <= list2.val:
            current.next = list1
            list1 = list1.next
        else:
            current.next = list2
            list2 = list2.next
        current = current.next
    
    current.next = list1 or list2
    return dummy.next`,
    explanation: 'Use a dummy node to simplify the merging process. Compare values from both lists and attach the smaller one to the result.',
    difficulty: 'easy',
    tags: ['linked-list', 'recursion'],
    status: 'new',
    createdAt: new Date(),
    nextReview: new Date(),
    interval: 1,
    easeFactor: 2.5,
    reviewCount: 0
  },
  {
    id: '5',
    title: 'Best Time to Buy and Sell Stock',
    problem: 'You are given an array prices where prices[i] is the price of a given stock on day i. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction.',
    solution: `def maxProfit(prices):
    if not prices:
        return 0
    
    min_price = prices[0]
    max_profit = 0
    
    for price in prices[1:]:
        max_profit = max(max_profit, price - min_price)
        min_price = min(min_price, price)
    
    return max_profit`,
    explanation: 'Track the minimum price seen so far and calculate profit for each day. Keep updating the maximum profit achievable.',
    difficulty: 'easy',
    tags: ['array', 'dynamic-programming'],
    status: 'new',
    createdAt: new Date(),
    nextReview: new Date(),
    interval: 1,
    easeFactor: 2.5,
    reviewCount: 0
  }
];