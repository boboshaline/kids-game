import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

interface TurnData{
    levelId:string;
    round:number;}

    interface AnalysisRequest{
        sessionId:string;
    }

interface RoundHistory {
  round: string;
  time: number;
  isCorrect: boolean;
}

interface AnalysisResponse {
  totalRounds: number;
  correctRounds: number;
  wrongAnswers: number;
  accuracy: string;
  avgTime: string;
  maxStreak: number;
  recommendation: string;
  history: RoundHistory[];
}

    

export const api=createApi({
    reducerPath:"api",
    baseQuery:fetchBaseQuery({
        baseUrl:"http://localhost:5000/api",
        // credentials:"omit",
    }),
    tagTypes:['Performance'],

    endpoints:(builder)=>({
        getGameRound:builder.query({
            query:({levelId,round}:TurnData)=>`/game/round?levelId=${levelId}&round=${round}`,
        }),

        processTurn:builder.mutation({
            query:(turnData)=>({
                url:"/game/process",
                method:"POST",
                body:turnData,
            }),
            invalidatesTags:['Performance'],
        }),

        //NEW ANALYSIS ENDPOINT

      getAnalysis: builder.query<AnalysisResponse, AnalysisRequest>({
  query: ({ sessionId }) => `/game/analysis/${sessionId}`, 
  providesTags: ['Performance'],
}),
    }), 

});

export const {useGetGameRoundQuery,useProcessTurnMutation,useGetAnalysisQuery}=api;