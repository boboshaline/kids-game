import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

interface TurnData{
    levelId:string;
    round:number;}

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
    }), 
});

export const {useGetGameRoundQuery,useProcessTurnMutation}=api;